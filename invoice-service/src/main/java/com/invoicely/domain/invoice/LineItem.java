package com.invoicely.domain.invoice;

import java.math.BigDecimal;
import java.util.UUID;

public record LineItem(
    UUID id,
    String description,
    int qty,
    BigDecimal rate
) {
    public BigDecimal subtotal() {
        return rate.multiply(BigDecimal.valueOf(qty));
    }
}
