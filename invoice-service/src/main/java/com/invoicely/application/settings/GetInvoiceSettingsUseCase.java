package com.invoicely.application.settings;

public interface GetInvoiceSettingsUseCase {
    InvoiceSettingsResponse execute(String userEmail);
}
