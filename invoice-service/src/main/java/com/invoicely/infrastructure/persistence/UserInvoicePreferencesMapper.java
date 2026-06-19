package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.preferences.UserInvoicePreferences;

final class UserInvoicePreferencesMapper {

    private UserInvoicePreferencesMapper() {}

    static UserInvoicePreferencesEntity toEntity(UserInvoicePreferences p) {
        return new UserInvoicePreferencesEntity(
                p.userEmail(), p.templateId(), p.paperSize(),
                p.issuerName(), p.issuerAddress(),
                p.taxPercent(), p.discount(), p.signature()
        );
    }

    static UserInvoicePreferences toDomain(UserInvoicePreferencesEntity e) {
        return new UserInvoicePreferences(
                e.getUserEmail(), e.getTemplateId(), e.getPaperSize(),
                e.getIssuerName(), e.getIssuerAddress(),
                e.getTaxPercent(), e.getDiscount(), e.getSignature()
        );
    }
}
