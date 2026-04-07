package com.freshmart.dto;

import java.time.LocalDateTime;

public record InventoryResponse(
    Long inventoryId,
    Long productId,
    Long storeId,
    Integer quantityOnHand,
    LocalDateTime lastUpdated,
    Boolean isActive
) {}