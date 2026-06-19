package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.settings.InvoicePrefixSetting;

final class UserInvoiceSettingsMapper {

    private UserInvoiceSettingsMapper() {}

    static InvoicePrefixSettingEntity toEntity(InvoicePrefixSetting setting) {
        return new InvoicePrefixSettingEntity(
                setting.id(), setting.userEmail(), setting.prefix(),
                setting.selected(), setting.createdAt());
    }

    static InvoicePrefixSetting toDomain(InvoicePrefixSettingEntity entity) {
        return new InvoicePrefixSetting(
                entity.getId(), entity.getUserEmail(), entity.getPrefix(),
                entity.isSelected(), entity.getCreatedAt());
    }
}
