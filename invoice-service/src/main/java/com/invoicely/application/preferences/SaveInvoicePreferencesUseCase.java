package com.invoicely.application.preferences;

public interface SaveInvoicePreferencesUseCase {
    InvoicePreferencesResponse execute(String userEmail, SaveInvoicePreferencesCommand command);
}
