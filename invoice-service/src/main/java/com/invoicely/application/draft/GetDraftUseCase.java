package com.invoicely.application.draft;

import java.util.UUID;

public interface GetDraftUseCase {
    DraftResponse execute(UUID id);
}
