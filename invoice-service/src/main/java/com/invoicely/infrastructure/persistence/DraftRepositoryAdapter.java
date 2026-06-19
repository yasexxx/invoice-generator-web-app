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
    public List<Draft> findAllByUserEmail(String userEmail) {
        log.debug("[REPO] Listing drafts userEmail={}", userEmail);
        return jpaRepository.findAllByUserEmail(userEmail).stream()
                .map(DraftMapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(UUID id) {
        log.debug("[REPO] Deleting draft id={}", id);
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByUserEmailAndInvoiceNumberExcluding(
            String userEmail, String invoiceNumber, UUID excludeId) {
        if (excludeId == null) {
            return jpaRepository.existsByUserEmailAndInvoiceNumber(userEmail, invoiceNumber);
        }
        return jpaRepository.existsByUserEmailAndInvoiceNumberAndIdNot(
                userEmail, invoiceNumber, excludeId);
    }

    @Override
    public List<String> findInvoiceNumbersByUserEmail(String userEmail) {
        log.debug("[REPO] Finding draft invoice numbers userEmail={}", userEmail);
        return jpaRepository.findInvoiceNumbersByUserEmail(userEmail);
    }
}
