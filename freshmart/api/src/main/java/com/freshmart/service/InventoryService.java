package com.freshmart.service;

import com.freshmart.dto.InventoryRequest;
import com.freshmart.dto.InventoryResponse;
import com.freshmart.dto.ProductInventoryResponse;
import com.freshmart.event.InventoryAdjustedEvent;
import com.freshmart.exception.InventoryNotFoundException;
import com.freshmart.exception.StoreNotFoundException;
import com.freshmart.mapper.InventoryMapper;
import com.freshmart.mapper.ProductInventoryMapper;
import com.freshmart.model.Inventory;
import com.freshmart.model.Product;
import com.freshmart.model.Store;
import com.freshmart.model.Transaction.TransactionType;
import com.freshmart.repository.InventoryRepository;
import com.freshmart.repository.StoreRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InventoryService {

    private static final String PRODUCT_ALREADY_IN_STORE = "Product already exists in this store's inventory";
    private static final String POSITIVE_QTY_REQUIRED = "Quantity must be greater than zero";
    private static final String NON_ZERO_ADJUSTMENT_REQUIRED = "Quantity change must not be zero";
    private static final String QTY_REQUIRED = "Quantity is required";
    private static final String QTY_CHANGE_REQUIRED = "Quantity change is required";
    
    private final InventoryRepository inventoryRepository;
    private final StoreRepository storeRepository;
    private final ProductService productService;
    private final CurrentUserService currentUserService;
    private final InventoryMapper inventoryMapper;
    private final ProductInventoryMapper productInventoryMapper;
    private final PricingService pricingService;
    private final ApplicationEventPublisher eventPublisher;
    
    public InventoryService(InventoryRepository inventoryRepository,
                   StoreRepository storeRepository,
                   ProductService productService,
                    CurrentUserService currentUserService,
                    InventoryMapper inventoryMapper,
                    ProductInventoryMapper productInventoryMapper,
                    PricingService pricingService,
                    ApplicationEventPublisher eventPublisher) {
        this.inventoryRepository = inventoryRepository;
        this.storeRepository = storeRepository;
        this.productService = productService;
        this.currentUserService = currentUserService;
        this.inventoryMapper = inventoryMapper;
        this.productInventoryMapper = productInventoryMapper;
        this.pricingService = pricingService;
        this.eventPublisher = eventPublisher;
    }
    
    @Transactional
    public InventoryResponse addToInventory(Long storeId, InventoryRequest request) {
        Store store = findStoreByIdOrThrow(storeId);
        
        Product product = productService.getProductEntity(request.productId());
        
        if (inventoryRepository.existsByProductProductIdAndStoreStoreId(request.productId(), storeId)) {
            throw new IllegalArgumentException(PRODUCT_ALREADY_IN_STORE);
        }
        
        Inventory inventory = new Inventory();
        inventory.setProduct(product);
        inventory.setStore(store);
        inventory.setQuantityOnHand(request.initialQuantity());
        inventory.setActive(true);
        inventory.setIsOnSale(false);
        inventory.setSalesPriceModifier(null);
        
        Inventory saved = inventoryRepository.save(inventory);
        
        if (request.initialQuantity() > 0) {
            InventoryAdjustedEvent event = InventoryAdjustedEvent.received(
                product.getProductId(),
                storeId,
                currentUserService.getCurrentUserId(),
                request.initialQuantity(),
                "Initial inventory setup"
            );
            eventPublisher.publishEvent(event);
        }
        
        return inventoryMapper.toResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public List<ProductInventoryResponse> getInventoryByStore(Long storeId) {
        return inventoryRepository.findActiveInventoryByStoreIdWithProduct(storeId).stream()
            .map(this::toProductInventoryResponse)
            .toList();
    }
    
    @Transactional(readOnly = true)
    public ProductInventoryResponse getProductInventory(Long productId, Long storeId) {
        return toProductInventoryResponse(findActiveInventoryOrThrow(productId, storeId));
    }
    
    @Transactional
    // Soft archive only: marks the store inventory record inactive without deleting the product globally.
    public void archiveFromStore(Long productId, Long storeId) {
        Inventory inventory = findActiveInventoryOrThrow(productId, storeId);
        inventory.setActive(false);
        inventoryRepository.save(inventory);
    }
    
    @Transactional
    public ProductInventoryResponse adjustQuantity(Long productId, Long storeId, Integer quantityChange, String notes) {
        validateNonZeroQuantityChange(quantityChange);
        return adjustQuantity(productId, storeId, quantityChange, notes, TransactionType.ADJUSTMENT);
    }

    @Transactional
    public ProductInventoryResponse receiveStock(Long productId, Long storeId, Integer quantity, String notes) {
        validatePositiveQuantity(quantity);
        return adjustQuantity(productId, storeId, quantity, notes, TransactionType.RECEIVE);
    }

    @Transactional
    public ProductInventoryResponse sellStock(Long productId, Long storeId, Integer quantity, String notes) {
        validatePositiveQuantity(quantity);
        return adjustQuantity(productId, storeId, -quantity, notes, TransactionType.SALE);
    }

    private ProductInventoryResponse adjustQuantity(Long productId,
                                                   Long storeId,
                                                   Integer quantityChange,
                                                   String notes,
                                                   TransactionType transactionType) {
        Inventory inventory = findActiveInventoryOrThrow(productId, storeId);
        
        int newQuantity = inventory.getQuantityOnHand() + quantityChange;
        if (newQuantity < 0) {
            throw new IllegalArgumentException("Insufficient inventory. Current: " + inventory.getQuantityOnHand() +
                ", attempted change: " + quantityChange);
        }
        
        inventory.setQuantityOnHand(newQuantity);
        Inventory saved = inventoryRepository.save(inventory);

        InventoryAdjustedEvent event = new InventoryAdjustedEvent(
            productId,
            storeId,
            currentUserService.getCurrentUserId(),
            transactionType,
            quantityChange,
            notes
        );
        eventPublisher.publishEvent(event);
        
        return toProductInventoryResponse(saved);
    }

    @Transactional
    public ProductInventoryResponse markProductOnSale(Long productId,
                                                      Long storeId,
                                                      BigDecimal salesPriceModifier) {
        Inventory inventory = findActiveInventoryOrThrow(productId, storeId);

        BigDecimal percentOff = pricingService.normalizeSalesPriceModifier(salesPriceModifier);
        inventory.setIsOnSale(true);
        inventory.setSalesPriceModifier(percentOff);

        Inventory saved = inventoryRepository.save(inventory);
        return toProductInventoryResponse(saved);
    }

    @Transactional
    public ProductInventoryResponse removeSale(Long productId, Long storeId) {
        Inventory inventory = findActiveInventoryOrThrow(productId, storeId);

        inventory.setIsOnSale(false);
        inventory.setSalesPriceModifier(null);

        Inventory saved = inventoryRepository.save(inventory);
        return toProductInventoryResponse(saved);
    }

    private Inventory findActiveInventoryOrThrow(Long productId, Long storeId) {
        return inventoryRepository.findByProductProductIdAndStoreStoreIdAndIsActiveTrue(productId, storeId)
            .orElseThrow(() -> new InventoryNotFoundException(
                "Product " + productId + " not found in store " + storeId + " inventory"));
    }

    private Store findStoreByIdOrThrow(Long storeId) {
        return storeRepository.findById(storeId)
            .orElseThrow(() -> new StoreNotFoundException("Store not found with id: " + storeId));
    }

    private void validatePositiveQuantity(Integer quantity) {
        requireNonNull(quantity, QTY_REQUIRED);
        if (quantity <= 0) {
            throw new IllegalArgumentException(POSITIVE_QTY_REQUIRED);
        }
    }

    private void validateNonZeroQuantityChange(Integer quantityChange) {
        requireNonNull(quantityChange, QTY_CHANGE_REQUIRED);
        if (quantityChange == 0) {
            throw new IllegalArgumentException(NON_ZERO_ADJUSTMENT_REQUIRED);
        }
    }

    private void requireNonNull(Integer value, String message) {
        if (value == null) {
            throw new IllegalArgumentException(message);
        }
    }

    private ProductInventoryResponse toProductInventoryResponse(Inventory inventory) {
        ProductInventoryResponse base = productInventoryMapper.toResponse(inventory);
        BigDecimal salePrice = pricingService.calculateSalePrice(
            base.retailPrice(),
            base.salesPriceModifier(),
            base.isOnSale()
        );

        return new ProductInventoryResponse(
            base.productId(),
            base.storeId(),
            base.productName(),
            base.category(),
            base.upc(),
            base.supplierName(),
            base.unitCost(),
            base.retailPrice(),
            base.isOnSale(),
            base.salesPriceModifier(),
            salePrice,
            base.quantityOnHand(),
            base.lastUpdated(),
            base.isFood(),
            base.isActive(),
            base.expirationDate(),
            base.reorderThreshold(),
            base.reorderQuantity(),
            base.inventoryId()
        );
    }
}
