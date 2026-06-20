package com.invoicely.application.draft;

import java.util.UUID;

public interface DeleteDraftUseCase {

    /**
     * Permanently removes the draft with the given ID.
     * Silently succeeds if no draft exists with that ID.
     *
     * @param id ID of the draft to delete
     */
    void delete(UUID id);
}
