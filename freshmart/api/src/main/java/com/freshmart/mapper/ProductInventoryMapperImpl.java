package com.freshmart.mapper;

import com.freshmart.dto.ProductInventoryResponse;
import com.freshmart.model.Inventory;
import com.freshmart.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductInventoryMapperImpl implements ProductInventoryMapper {

    @Override
    public ProductInventoryResponse toResponse(Inventory inventory) {
        if (inventory == null) {
            return null;
        }

        Product product = inventory.getProduct();

        String supplierName = null;
        if (product != null && product.getSupplier() != null) {
            supplierName = product.getSupplier().getSupplierName();
        }

        return new ProductInventoryResponse(
            product != null ? product.getProductId() : null,
            inventory.getStore() != null ? inventory.getStore().getStoreId() : null,
            product != null ? product.getProductName() : null,
            product != null ? product.getCategory() : null,
            product != null ? product.getUpc() : null,
            supplierName,
            product != null ? product.getUnitCost() : null,
            product != null ? product.getRetailPrice() : null,
            inventory.getIsOnSale(),
            inventory.getSalesPriceModifier(),
            null,
            inventory.getQuantityOnHand(),
            inventory.getLastUpdated(),
            product != null ? product.getIsFood() : null,
            product != null ? product.getIsActive() : null,
            product != null ? product.getExpirationDate() : null,
            product != null ? product.getReorderThreshold() : null,
            product != null ? product.getReorderQuantity() : null,
            inventory.getInventoryId()
        );
    }
}
