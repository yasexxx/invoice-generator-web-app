package com.invoicely.domain.preferences;

import java.math.BigDecimal;
import java.util.Objects;

public record UserInvoicePreferences(
        String     userEmail,
        String     templateId,
        String     paperSize,
        String     issuerName,
        String     issuerAddress,
        BigDecimal taxPercent,
        BigDecimal discount,
        String     signature
) {
    public UserInvoicePreferences {
        Objects.requireNonNull(userEmail,   "userEmail");
        Objects.requireNonNull(templateId, "templateId");
        Objects.requireNonNull(paperSize,  "paperSize");
        Objects.requireNonNull(taxPercent, "taxPercent");
        Objects.requireNonNull(discount,   "discount");
        issuerName    = issuerName    != null ? issuerName    : "";
        issuerAddress = issuerAddress != null ? issuerAddress : "";
        signature     = signature     != null ? signature     : "";
    }
}
