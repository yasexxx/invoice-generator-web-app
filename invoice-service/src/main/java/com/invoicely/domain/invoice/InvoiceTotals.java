package com.invoicely.domain.invoice;

import java.math.BigDecimal;

public record InvoiceTotals(
    BigDecimal subtotal,
    BigDecimal taxAmount,
    BigDecimal total
) {}
