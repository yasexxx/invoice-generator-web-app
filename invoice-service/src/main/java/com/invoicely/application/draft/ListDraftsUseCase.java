package com.invoicely.application.draft;

import java.util.List;

public interface ListDraftsUseCase {
    List<DraftSummaryResponse> execute(String userEmail);
}
