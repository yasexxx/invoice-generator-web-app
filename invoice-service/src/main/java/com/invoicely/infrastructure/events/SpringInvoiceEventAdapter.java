package com.invoicely.infrastructure.events;

import com.invoicely.application.port.InvoiceEventPort;
import com.invoicely.domain.invoice.events.InvoiceDraftedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SpringInvoiceEventAdapter implements InvoiceEventPort {

    private final ApplicationEventPublisher publisher;

    @Override
    public void publish(InvoiceDraftedEvent event) {
        log.debug("[EVENT] Publishing InvoiceDraftedEvent invoiceId={}", event.invoiceId());
        publisher.publishEvent(event);
    }
}
