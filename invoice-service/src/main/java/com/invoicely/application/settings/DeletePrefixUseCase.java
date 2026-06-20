package com.invoicely.application.settings;

import java.util.UUID;

public interface DeletePrefixUseCase {

    /**
     * Permanently removes an invoice prefix belonging to the given user.
     * Silently succeeds if no prefix exists with that ID.
     *
     * @param userEmail email address identifying the owning user
     * @param prefixId  ID of the prefix to delete
     */
    void execute(String userEmail, UUID prefixId);
}
