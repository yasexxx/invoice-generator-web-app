package com.invoicely.application.draft;

public interface CreateDraftUseCase {

    /**
     * Persists a new invoice draft for the user identified in the command.
     * Throws {@link com.invoicely.application.invoice.DuplicateInvoiceNumberException}
     * if the invoice number is already used in drafts or finalised invoices.
     *
     * @param command command carrying all draft fields and the owning user email
     * @return summary response with the new draft ID and invoice number
     */
    DraftSummaryResponse execute(SaveDraftCommand command);
}
