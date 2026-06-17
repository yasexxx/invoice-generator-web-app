package com.invoicely.application.invoice;

public interface CreateInvoiceUseCase {
    InvoiceResponse execute(CreateInvoiceCommand command);
}
