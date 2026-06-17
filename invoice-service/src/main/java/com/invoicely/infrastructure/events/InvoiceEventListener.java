package com.invoicely.infrastructure.events;

import com.invoicely.domain.invoice.events.InvoiceDraftedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class InvoiceEventListener {

    @Async
    @EventListener
    public void onInvoiceDrafted(InvoiceDraftedEvent event) {
        log.info("[LISTENER] Invoice drafted: id={} clientEmail={}", event.invoiceId(), event.clientEmail());
    }
}
