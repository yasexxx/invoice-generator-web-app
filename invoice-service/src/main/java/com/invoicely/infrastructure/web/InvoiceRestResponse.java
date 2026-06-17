package com.invoicely.infrastructure.web;

import java.math.BigDecimal;
import java.util.UUID;

public record InvoiceRestResponse(
        UUID invoiceId,
        TotalsDto totals
) {
    public record TotalsDto(BigDecimal subtotal, BigDecimal taxAmount, BigDecimal total) {}
}
