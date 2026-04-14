package com.freshmart.mapper;

import com.freshmart.dto.InventoryResponse;
import com.freshmart.model.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapperImpl implements InventoryMapper {

    @Override
    public InventoryResponse toResponse(Inventory inventory) {
        if (inventory == null) {
            return null;
        }

        Long productId = inventory.getProduct() != null ? inventory.getProduct().getProductId() : null;
        Long storeId = inventory.getStore() != null ? inventory.getStore().getStoreId() : null;

        return new InventoryResponse(
            inventory.getInventoryId(),
            productId,
            storeId,
            inventory.getQuantityOnHand(),
            inventory.getLastUpdated(),
            inventory.isActive()
        );
    }
}
