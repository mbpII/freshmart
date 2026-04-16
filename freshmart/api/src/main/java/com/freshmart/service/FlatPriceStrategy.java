package com.freshmart.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Accepts a flat sale price and derives the percent-off modifier from the retail price.
 */
@Component
public class FlatPriceStrategy implements SalePricingStrategy {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final int PERCENTAGE_SCALE = 6;

    @Override
    public BigDecimal computeModifier(BigDecimal retailPrice, BigDecimal inputValue) {
        if (inputValue == null) {
            throw new IllegalArgumentException("Sale price is required");
        }
        if (retailPrice == null || retailPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Retail price must be positive");
        }
        if (inputValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Sale price must be greater than 0");
        }
        if (inputValue.compareTo(retailPrice) >= 0) {
            throw new IllegalArgumentException("Sale price must be less than retail price");
        }

        BigDecimal modifier = retailPrice.subtract(inputValue)
            .divide(retailPrice, PERCENTAGE_SCALE, RoundingMode.HALF_UP)
            .multiply(HUNDRED)
            .setScale(2, RoundingMode.HALF_UP);

        if (modifier.compareTo(BigDecimal.ZERO) <= 0 || modifier.compareTo(HUNDRED) >= 0) {
            throw new IllegalArgumentException("Derived percent off is out of valid range");
        }
        return modifier;
    }
}
