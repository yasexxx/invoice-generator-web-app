package com.invoicely.application.preferences;

public interface SaveInvoicePreferencesUseCase {

    /**
     * Persists or replaces the invoice preferences (template and paper size) for the given user.
     *
     * @param userEmail email address identifying the owning user
     * @param command   command carrying the preferred template ID and paper size
     * @return the updated preferences
     */
    InvoicePreferencesResponse execute(String userEmail, SaveInvoicePreferencesCommand command);
}
