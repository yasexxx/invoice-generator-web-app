package com.invoicely.domain.invoice.events;

import java.time.Instant;
import java.util.UUID;

public record InvoiceDraftedEvent(
    UUID invoiceId,
    String clientEmail,
    Instant occurredAt
) {}
