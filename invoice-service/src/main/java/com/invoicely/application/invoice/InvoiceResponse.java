package com.invoicely.application.invoice;

import com.invoicely.domain.invoice.InvoiceTotals;

import java.util.UUID;

public record InvoiceResponse(
    UUID invoiceId,
    InvoiceTotals totals
) {}
