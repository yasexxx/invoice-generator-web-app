package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.settings.InvoicePrefixSetting;
import com.invoicely.domain.settings.UserInvoiceSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
@Slf4j
public class UserInvoiceSettingsRepositoryAdapter implements UserInvoiceSettingsRepository {

    private final InvoicePrefixSettingJpaRepository jpaRepository;

    @Override
    public List<InvoicePrefixSetting> findByUserEmail(String userEmail) {
        log.debug("[REPO] Finding prefixes userEmail={}", userEmail);
        return jpaRepository.findByUserEmail(userEmail).stream()
                .map(UserInvoiceSettingsMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<InvoicePrefixSetting> findSelectedByUserEmail(String userEmail) {
        log.debug("[REPO] Finding selected prefix userEmail={}", userEmail);
        return jpaRepository.findByUserEmailAndSelectedTrue(userEmail)
                .map(UserInvoiceSettingsMapper::toDomain);
    }

    @Override
    public InvoicePrefixSetting save(InvoicePrefixSetting setting) {
        log.debug("[REPO] Saving prefix id={}", setting.id());
        return UserInvoiceSettingsMapper.toDomain(
                jpaRepository.save(UserInvoiceSettingsMapper.toEntity(setting)));
    }

    @Override
    public void deleteById(UUID id) {
        log.debug("[REPO] Deleting prefix id={}", id);
        jpaRepository.deleteById(id);
    }

    @Override
    public void clearSelectionForUser(String userEmail) {
        log.debug("[REPO] Clearing selection userEmail={}", userEmail);
        jpaRepository.clearSelectionForUser(userEmail);
    }

    @Override
    public boolean existsByUserEmailAndPrefix(String userEmail, String prefix) {
        return jpaRepository.existsByUserEmailAndPrefix(userEmail, prefix);
    }
}
