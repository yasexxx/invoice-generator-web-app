package com.invoicely.application.draft;

import java.util.List;

public interface ListDraftsUseCase {

    /**
     * Returns all draft summaries owned by the given user, ordered by last updated descending.
     *
     * @param userEmail email address identifying the owning user
     * @return list of draft summaries; empty list when the user has no drafts
     */
    List<DraftSummaryResponse> execute(String userEmail);
}
