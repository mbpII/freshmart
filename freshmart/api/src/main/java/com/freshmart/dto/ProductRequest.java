package com.freshmart.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ProductRequest(
    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name must not exceed 200 characters")
    String productName,
    
    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    String category,
    
    @NotBlank(message = "UPC is required")
    @Size(max = 50, message = "UPC must not exceed 50 characters")
    String upc,

    @Positive(message = "Supplier ID must be positive")
    Long supplierId,
    
    @DecimalMin(value = "0.00", message = "Unit cost must be non-negative")
    BigDecimal unitCost,
    
    @NotNull(message = "Retail price is required")
    @DecimalMin(value = "0.01", message = "Retail price must be positive")
    BigDecimal retailPrice,
    
    Boolean isFood,
    
    Integer reorderThreshold,
    
    Integer reorderQuantity,
    
    LocalDate expirationDate
) {

    public ProductRequest {
        validateCore(isFood, expirationDate, reorderThreshold, reorderQuantity);
    }

    static void validateCore(Boolean isFood,
                             LocalDate expirationDate,
                             Integer reorderThreshold,
                             Integer reorderQuantity) {
        if (Boolean.TRUE.equals(isFood) && expirationDate == null) {
            throw new IllegalArgumentException("Expiration date is required for food products");
        }
        validateNonNegative(reorderThreshold, "Reorder threshold");
        validateNonNegative(reorderQuantity, "Reorder quantity");
    }

    private static void validateNonNegative(Integer value, String fieldName) {
        if (value != null && value < 0) {
            throw new IllegalArgumentException(fieldName + " must be non-negative");
        }
    }
}
