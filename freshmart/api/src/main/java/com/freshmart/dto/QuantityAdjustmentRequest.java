package com.freshmart.dto;

import jakarta.validation.constraints.*;

public record QuantityAdjustmentRequest(
    @NotNull(message = "Quantity change is required")
    Integer quantityChange,
    
    @NotBlank(message = "Notes are required")
    @Size(max = 500, message = "Notes must not exceed 500 characters")
    String notes
) {}