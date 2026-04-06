package com.freshmart.event;

import com.freshmart.model.Transaction.TransactionType;

public record InventoryAdjustedEvent(
    Long productId,
    Long storeId,
    Long userId,
    TransactionType transactionType,
    Integer quantityChange,
    String notes
) {
    public static InventoryAdjustedEvent received(Long productId, Long storeId, Long userId, Integer quantityChange, String notes) {
        return new InventoryAdjustedEvent(productId, storeId, userId, TransactionType.RECEIVE, quantityChange, notes);
    }
    
    public static InventoryAdjustedEvent sold(Long productId, Long storeId, Long userId, Integer quantityChange, String notes) {
        return new InventoryAdjustedEvent(productId, storeId, userId, TransactionType.SALE, quantityChange, notes);
    }
    
    public static InventoryAdjustedEvent adjusted(Long productId, Long storeId, Long userId, Integer quantityChange, String notes) {
        return new InventoryAdjustedEvent(productId, storeId, userId, TransactionType.ADJUSTMENT, quantityChange, notes);
    }
}