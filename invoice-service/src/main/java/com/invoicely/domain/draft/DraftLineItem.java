package com.invoicely.domain.draft;

import java.math.BigDecimal;
import java.util.UUID;

public record DraftLineItem(
        UUID   id,
        String description,
        int    qty,
        BigDecimal rate
) {}
