package com.freshmart.mapper;

import com.freshmart.dto.InventoryResponse;
import com.freshmart.model.Inventory;

public interface InventoryMapper {

    InventoryResponse toResponse(Inventory inventory);
}
