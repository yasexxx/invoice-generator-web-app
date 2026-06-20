package com.invoicely.application.invoice;

public interface CreateInvoiceUseCase {

    /**
     * Creates a new invoice from a validated command and publishes an {@link com.invoicely.domain.invoice.events.InvoiceDraftedEvent}.
     * Throws {@link DuplicateInvoiceNumberException} if the invoice number already exists for this user.
     *
     * @param command validated command carrying client details and line items
     * @return response containing the new invoice ID and calculated totals
     */
    InvoiceResponse execute(CreateInvoiceCommand command);
}
