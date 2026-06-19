package com.invoicely.application.draft;

import java.util.UUID;

public interface UpdateDraftUseCase {
    DraftSummaryResponse execute(UUID id, SaveDraftCommand command);
}
