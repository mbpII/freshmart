package com.freshmart.dto;

import jakarta.validation.constraints.*;

public record InventoryRequest(
    @NotNull(message = "Product ID is required")
    @Positive(message = "Product ID must be positive")
    Long productId,
    
    @NotNull(message = "Initial quantity is required")
    @Min(value = 0, message = "Quantity must be non-negative")
    Integer initialQuantity
) {}
