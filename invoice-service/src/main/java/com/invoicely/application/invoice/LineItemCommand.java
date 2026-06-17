package com.invoicely.application.invoice;

import java.math.BigDecimal;

public record LineItemCommand(
    String description,
    int qty,
    BigDecimal rate
) {}
