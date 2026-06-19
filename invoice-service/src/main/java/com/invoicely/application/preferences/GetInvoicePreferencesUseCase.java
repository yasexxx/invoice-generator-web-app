package com.invoicely.application.preferences;

public interface GetInvoicePreferencesUseCase {
    InvoicePreferencesResponse execute(String userEmail);
}
