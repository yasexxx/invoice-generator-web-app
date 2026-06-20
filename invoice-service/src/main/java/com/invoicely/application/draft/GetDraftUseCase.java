package com.invoicely.application.draft;

import java.util.UUID;

public interface GetDraftUseCase {

    /**
     * Retrieves a single draft by its ID.
     * Throws {@link java.util.NoSuchElementException} if no draft exists with the given ID.
     *
     * @param id ID of the draft to retrieve
     * @return full draft response including all fields and line items
     */
    DraftResponse execute(UUID id);
}
