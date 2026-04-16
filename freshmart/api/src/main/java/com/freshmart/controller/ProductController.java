package com.freshmart.controller;

import com.freshmart.dto.CreateProductRequest;
import com.freshmart.dto.InventoryRequest;
import com.freshmart.dto.ProductInventoryResponse;
import com.freshmart.dto.ProductRequest;
import com.freshmart.dto.ProductResponse;
import com.freshmart.mapper.ProductMapper;
import com.freshmart.service.InventoryService;
import com.freshmart.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Product catalog management")
@Validated
public class ProductController {
    
    private static final Long DEFAULT_STORE_ID = 101L;

    private final ProductService productService;
    private final InventoryService inventoryService;
    private final ProductMapper productMapper;
    
    public ProductController(ProductService productService, InventoryService inventoryService, ProductMapper productMapper) {
        this.productService = productService;
        this.inventoryService = inventoryService;
        this.productMapper = productMapper;
    }
    
    @PostMapping
    @Operation(summary = "Create a new product with initial inventory")
    public ResponseEntity<ProductInventoryResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        var productResponse = productService.createProduct(productMapper.toProductRequest(request));

        // TODO: replace with CurrentUserService when auth is implemented
        var storeId = resolveStoreId(request.storeId());
        var initialQty = request.initialQuantity() != null ? request.initialQuantity() : 0;

        var inventoryRequest = new InventoryRequest(productResponse.productId(), initialQty);
        inventoryService.addToInventory(storeId, inventoryRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(inventoryService.getProductInventory(productResponse.productId(), storeId));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    
    @GetMapping
    @Operation(summary = "Get all products for a store")
    public ResponseEntity<List<ProductInventoryResponse>> getProductsByStore(
            @Parameter(description = "Store ID") @RequestParam(required = false) @Positive Long storeId) {
        var storeIdToUse = resolveStoreId(storeId);
        return ResponseEntity.ok(inventoryService.getInventoryByStore(storeIdToUse));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update product details")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable @Positive Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }
    
    // User-facing delete action is implemented as a soft archive in inventory for Epic 1.
    // This does not remove the product record globally.
    @DeleteMapping("/{id}")
    @Operation(summary = "Archive product (soft delete)")
    public ResponseEntity<Void> archiveProduct(
            @PathVariable @Positive Long id,
            @Parameter(description = "Store ID") @RequestParam(required = false) @Positive Long storeId) {
        // TODO: replace with CurrentUserService when auth is implemented
        var storeIdToUse = resolveStoreId(storeId);
        inventoryService.archiveFromStore(id, storeIdToUse);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/sale/percent")
    @Operation(summary = "Mark product on sale by percent off (e.g. value=10 means 10% off)")
    public ResponseEntity<ProductInventoryResponse> markOnSaleByPercent(
            @PathVariable @Positive Long id,
            @RequestParam(name = "storeId") @Positive Long storeId,
            @RequestParam(name = "value") BigDecimal value) {
        return ResponseEntity.ok(inventoryService.markProductOnSaleByPercent(id, storeId, value));
    }

    @PostMapping("/{id}/sale/flat")
    @Operation(summary = "Mark product on sale by flat sale price (e.g. value=5.99 sets sale price to $5.99)")
    public ResponseEntity<ProductInventoryResponse> markOnSaleByFlat(
            @PathVariable @Positive Long id,
            @RequestParam(name = "storeId") @Positive Long storeId,
            @RequestParam(name = "value") BigDecimal value) {
        return ResponseEntity.ok(inventoryService.markProductOnSaleByFlat(id, storeId, value));
    }
    
    @DeleteMapping("/{id}/sale")
    @Operation(summary = "Remove sale from product")
    public ResponseEntity<ProductInventoryResponse> removeSale(
            @PathVariable @Positive Long id,
            @RequestParam(name = "storeId") @Positive Long storeId) {
        return ResponseEntity.ok(inventoryService.removeSale(id, storeId));
    }

    private Long resolveStoreId(Long storeId) {
        return storeId != null ? storeId : DEFAULT_STORE_ID;
    }
}
