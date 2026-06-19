package com.invoicely.application.draft;

import java.time.Instant;
import java.util.UUID;

public record DraftSummaryResponse(
        UUID    draftId,
        String  invoiceNumber,
        String  clientName,
        Instant updatedAt
) {}
