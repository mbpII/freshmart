package com.freshmart.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record SaleRequest(
    @NotNull(message = "Sale price is required when marking on sale")
    @DecimalMin(value = "0.01", message = "Sale price must be positive")
    BigDecimal salePrice
) {}