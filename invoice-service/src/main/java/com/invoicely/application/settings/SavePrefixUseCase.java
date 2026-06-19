package com.invoicely.application.settings;

import java.util.UUID;

public interface SavePrefixUseCase {
    InvoiceSettingsResponse.PrefixDto execute(String userEmail, String prefix);
    InvoiceSettingsResponse.PrefixDto select(String userEmail, UUID prefixId);
}
