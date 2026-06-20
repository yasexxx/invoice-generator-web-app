package com.invoicely.application.settings;

public interface GetInvoiceSettingsUseCase {

    /**
     * Retrieves the invoice settings for a user, including all saved prefixes and the next suggested invoice number.
     * If the user has no prefixes the default prefix {@code INV-} is used to compute the next number.
     *
     * @param userEmail email address identifying the user
     * @return settings response with prefix list and pre-computed next invoice number
     */
    InvoiceSettingsResponse execute(String userEmail);
}
