package com.invoicely.infrastructure.web;

import java.math.BigDecimal;

public record InvoicePreferencesRestResponse(
        String     templateId,
        String     paperSize,
        String     issuerName,
        String     issuerAddress,
        BigDecimal taxPercent,
        BigDecimal discount,
        String     signature
) {}
