package com.invoicely.infrastructure.web;

import java.time.Instant;
import java.util.UUID;

public record DraftSummaryRestResponse(
        UUID    draftId,
        String  invoiceNumber,
        String  clientName,
        Instant updatedAt
) {}
