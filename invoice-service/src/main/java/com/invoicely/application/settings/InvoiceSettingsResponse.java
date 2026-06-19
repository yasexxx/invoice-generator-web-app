package com.invoicely.application.settings;

import java.util.List;
import java.util.UUID;

public record InvoiceSettingsResponse(
        List<PrefixDto> prefixes,
        String          nextInvoiceNumber
) {
    public record PrefixDto(UUID id, String prefix, boolean selected) {}
}
