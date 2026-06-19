package com.invoicely.domain.invoice;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository {
    Invoice          save(Invoice invoice);
    Optional<Invoice> findById(UUID id);
    void             deleteById(UUID id);
    List<String>     findInvoiceNumbersByUserEmail(String userEmail);
    boolean          existsByUserEmailAndInvoiceNumber(String userEmail, String invoiceNumber);
}
