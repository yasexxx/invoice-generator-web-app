package com.invoicely.application.draft;

public interface CreateDraftUseCase {
    DraftSummaryResponse execute(SaveDraftCommand command);
}
