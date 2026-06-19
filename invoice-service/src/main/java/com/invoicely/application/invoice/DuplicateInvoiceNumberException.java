package com.invoicely.application.invoice;

public class DuplicateInvoiceNumberException extends RuntimeException {

    public DuplicateInvoiceNumberException(String invoiceNumber) {
        super("Invoice number already in use: " + invoiceNumber);
    }
}
