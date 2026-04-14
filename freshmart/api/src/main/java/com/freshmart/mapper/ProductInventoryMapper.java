package com.freshmart.mapper;

import com.freshmart.dto.ProductInventoryResponse;
import com.freshmart.model.Inventory;

public interface ProductInventoryMapper {

    ProductInventoryResponse toResponse(Inventory inventory);
}
