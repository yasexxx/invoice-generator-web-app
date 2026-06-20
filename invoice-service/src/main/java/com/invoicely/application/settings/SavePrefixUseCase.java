package com.invoicely.application.settings;

import java.util.UUID;

public interface SavePrefixUseCase {

    /**
     * Saves a new invoice prefix for the user and marks it as selected.
     * If a prefix with the same value already exists it is selected without duplication.
     *
     * @param userEmail email address identifying the owning user
     * @param prefix    the prefix string to save (e.g. {@code "INV-"})
     * @return the saved or selected prefix DTO
     */
    InvoiceSettingsResponse.PrefixDto execute(String userEmail, String prefix);

    /**
     * Marks an existing prefix as selected and deselects all others for the user.
     * Throws {@link java.util.NoSuchElementException} if no prefix exists with the given ID.
     *
     * @param userEmail email address identifying the owning user
     * @param prefixId  ID of the prefix to select
     * @return the newly selected prefix DTO
     */
    InvoiceSettingsResponse.PrefixDto select(String userEmail, UUID prefixId);
}
