package com.invoicely.domain.draft;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DraftRepository {
    Draft           save(Draft draft);
    Optional<Draft> findById(UUID id);
    List<Draft>     findAll();
    void            deleteById(UUID id);
}
