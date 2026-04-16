package com.freshmart.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Accepts a percent-off value (e.g. 10 for 10% off) directly as the modifier.
 */
@Component
public class PercentOffStrategy implements SalePricingStrategy {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    @Override
    public BigDecimal computeModifier(BigDecimal retailPrice, BigDecimal inputValue) {
        if (inputValue == null) {
            throw new IllegalArgumentException("Percent off value is required");
        }

        BigDecimal roundedValue = inputValue.setScale(2, RoundingMode.HALF_UP);
        if (roundedValue.compareTo(BigDecimal.ZERO) <= 0 || roundedValue.compareTo(HUNDRED) >= 0) {
            throw new IllegalArgumentException("Percent off must be greater than 0 and less than 100");
        }

        return roundedValue;
    }
}
