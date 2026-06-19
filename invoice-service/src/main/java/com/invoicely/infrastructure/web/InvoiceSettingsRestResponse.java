package com.invoicely.infrastructure.web;

import java.util.List;
import java.util.UUID;

public record InvoiceSettingsRestResponse(
        List<PrefixDto> prefixes,
        String          nextInvoiceNumber
) {
    public record PrefixDto(UUID id, String prefix, boolean selected) {}
}
