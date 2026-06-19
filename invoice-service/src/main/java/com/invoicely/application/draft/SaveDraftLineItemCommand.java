package com.invoicely.application.draft;

import java.math.BigDecimal;

public record SaveDraftLineItemCommand(
        String     description,
        int        qty,
        BigDecimal rate
) {}
