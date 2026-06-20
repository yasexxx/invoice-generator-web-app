package com.invoicely.application.draft;

import java.util.UUID;

public interface UpdateDraftUseCase {

    /**
     * Replaces the content of an existing draft, preserving its original creation timestamp.
     * Throws {@link java.util.NoSuchElementException} if no draft exists with the given ID.
     * Throws {@link com.invoicely.application.invoice.DuplicateInvoiceNumberException}
     * if the updated invoice number conflicts with another draft or finalised invoice.
     *
     * @param id      ID of the draft to update
     * @param command command with the replacement field values
     * @return updated summary response
     */
    DraftSummaryResponse execute(UUID id, SaveDraftCommand command);
}
