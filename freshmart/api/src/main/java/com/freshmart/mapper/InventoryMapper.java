package com.freshmart.mapper;

import com.freshmart.dto.InventoryResponse;
import com.freshmart.model.Inventory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InventoryMapper {
    
    @Mapping(source = "product.productId", target = "productId")
    @Mapping(source = "store.storeId", target = "storeId")
    @Mapping(target = "isActive", constant = "true")
    InventoryResponse toResponse(Inventory inventory);
}