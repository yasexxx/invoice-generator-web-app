package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.draft.Draft;
import com.invoicely.domain.draft.DraftRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
@Slf4j
public class DraftRepositoryAdapter implements DraftRepository {

    private final DraftJpaRepository jpaRepository;

    @Override
    public Draft save(Draft draft) {
        log.debug("[REPO] Saving draft id={}", draft.id());
        return DraftMapper.toDomain(jpaRepository.save(DraftMapper.toEntity(draft)));
    }

    @Override
    public Optional<Draft> findById(UUID id) {
        log.debug("[REPO] Finding draft id={}", id);
        return jpaRepository.findById(id).map(DraftMapper::toDomain);
    }

    @Override
    public List<Draft> findAll() {
        log.debug("[REPO] Listing all drafts");
        return jpaRepository.findAll().stream().map(DraftMapper::toDomain).toList();
    }

    @Override
    public void deleteById(UUID id) {
        log.debug("[REPO] Deleting draft id={}", id);
        jpaRepository.deleteById(id);
    }
}
