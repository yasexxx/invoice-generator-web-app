package com.invoicely.domain.settings;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserInvoiceSettingsRepository {
    List<InvoicePrefixSetting>     findByUserEmail(String userEmail);
    Optional<InvoicePrefixSetting> findSelectedByUserEmail(String userEmail);
    InvoicePrefixSetting           save(InvoicePrefixSetting setting);
    void                           deleteById(UUID id);
    void                           clearSelectionForUser(String userEmail);
    boolean                        existsByUserEmailAndPrefix(String userEmail, String prefix);
}
