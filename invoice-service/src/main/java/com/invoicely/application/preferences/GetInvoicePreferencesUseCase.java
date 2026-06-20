package com.invoicely.application.preferences;

public interface GetInvoicePreferencesUseCase {

    /**
     * Retrieves the saved invoice preferences (template and paper size) for the given user.
     * Returns default preferences if the user has not yet saved any.
     *
     * @param userEmail email address identifying the user
     * @return the user's current invoice preferences
     */
    InvoicePreferencesResponse execute(String userEmail);
}
