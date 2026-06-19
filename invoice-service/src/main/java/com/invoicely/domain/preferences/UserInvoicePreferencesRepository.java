package com.invoicely.domain.preferences;

import java.util.Optional;

public interface UserInvoicePreferencesRepository {
    Optional<UserInvoicePreferences> findByUserEmail(String userEmail);
    UserInvoicePreferences           save(UserInvoicePreferences preferences);
}
