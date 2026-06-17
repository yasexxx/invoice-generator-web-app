package com.invoicely.infrastructure.events;

import com.invoicely.domain.invoice.events.InvoiceDraftedEvent;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SpringInvoiceEventAdapterTest {

    @Mock
    private ApplicationEventPublisher publisher;

    @InjectMocks
    private SpringInvoiceEventAdapter adapter;

    @Test
    void publish_delegatesToApplicationEventPublisher() {
        InvoiceDraftedEvent event = new InvoiceDraftedEvent(
                UUID.randomUUID(), "test@example.com", Instant.now()
        );

        adapter.publish(event);

        verify(publisher).publishEvent(event);
    }
}
