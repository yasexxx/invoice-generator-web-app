package com.invoicely.application.settings;

import java.util.UUID;

public interface DeletePrefixUseCase {
    void execute(String userEmail, UUID prefixId);
}
