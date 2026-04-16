package com.freshmart.service;

import java.math.BigDecimal;

/**
 * Strategy for computing a percent-off modifier from a sale input value.
 * Implementations handle different input types (percent off, flat sale price).
 */
public interface SalePricingStrategy {

    /**
     * Converts the raw input value into a percent-off modifier stored on the inventory record.
     *
     * @param retailPrice the product's regular retail price
     * @param inputValue  the raw value entered by the user (meaning depends on strategy)
     * @return percent-off modifier in the range (0, 100), rounded to 2 decimal places
     * @throws IllegalArgumentException if the input is invalid
     */
    BigDecimal computeModifier(BigDecimal retailPrice, BigDecimal inputValue);
}
