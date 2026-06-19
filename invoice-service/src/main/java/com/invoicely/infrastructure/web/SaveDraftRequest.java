package com.invoicely.infrastructure.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record SaveDraftRequest(
        String templateId,
        String paperSize,
        String invoiceNumber,
        String issuedDate,
        String dueDate,
        String issuerName,
        String issuerAddress,
        String clientName,
        String clientEmail,
        String clientAddress,
        @NotNull @Valid List<LineItemRequest> lineItems,
        @NotNull @DecimalMin("0") BigDecimal taxPercent,
        @NotNull @DecimalMin("0") BigDecimal discount,
        String notes,
        String signature
) {
    public record LineItemRequest(
            String description,
            @Min(0) int qty,
            @NotNull @DecimalMin("0") BigDecimal rate
    ) {}
}
