package com.invoicely.application.port;

import com.invoicely.domain.invoice.events.InvoiceDraftedEvent;

public interface InvoiceEventPort {
    void publish(InvoiceDraftedEvent event);
}
