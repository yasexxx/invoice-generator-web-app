package com.invoicely.application.preferences;

import java.math.BigDecimal;

public record SaveInvoicePreferencesCommand(
        String     templateId,
        String     paperSize,
        String     issuerName,
        String     issuerAddress,
        BigDecimal taxPercent,
        BigDecimal discount,
        String     signature
) {}
