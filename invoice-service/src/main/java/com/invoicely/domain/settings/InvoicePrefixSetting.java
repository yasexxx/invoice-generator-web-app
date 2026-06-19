package com.invoicely.domain.settings;

import java.time.Instant;
import java.util.UUID;

public record InvoicePrefixSetting(
        UUID    id,
        String  userEmail,
        String  prefix,
        boolean selected,
        Instant createdAt
) {}
