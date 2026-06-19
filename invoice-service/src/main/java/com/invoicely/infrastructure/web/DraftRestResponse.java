package com.invoicely.infrastructure.web;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record DraftRestResponse(
        UUID    draftId,
        String  templateId,
        String  paperSize,
        String  invoiceNumber,
        String  issuedDate,
        String  dueDate,
        String  issuerName,
        String  issuerAddress,
        String  clientName,
        String  clientEmail,
        String  clientAddress,
        List<LineItemDto> lineItems,
        BigDecimal taxPercent,
        BigDecimal discount,
        String  notes,
        String  signature,
        Instant updatedAt
) {
    public record LineItemDto(
            UUID       id,
            String     description,
            int        qty,
            BigDecimal rate
    ) {}
}
