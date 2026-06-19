package com.invoicely.application.preferences;

import java.math.BigDecimal;

public record InvoicePreferencesResponse(
        String     templateId,
        String     paperSize,
        String     issuerName,
        String     issuerAddress,
        BigDecimal taxPercent,
        BigDecimal discount,
        String     signature
) {}
