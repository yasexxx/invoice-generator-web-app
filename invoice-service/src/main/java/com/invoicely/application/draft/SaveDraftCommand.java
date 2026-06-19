package com.invoicely.application.draft;

import java.math.BigDecimal;
import java.util.List;

public record SaveDraftCommand(
        String     templateId,
        String     paperSize,
        String     invoiceNumber,
        String     issuedDate,
        String     dueDate,
        String     issuerName,
        String     issuerAddress,
        String     clientName,
        String     clientEmail,
        String     clientAddress,
        List<SaveDraftLineItemCommand> lineItems,
        BigDecimal taxPercent,
        BigDecimal discount,
        String     notes,
        String     signature
) {}
