package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.preferences.UserInvoicePreferences;
import com.invoicely.domain.preferences.UserInvoicePreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class UserInvoicePreferencesRepositoryAdapter implements UserInvoicePreferencesRepository {

    private final UserInvoicePreferencesJpaRepository jpaRepository;

    @Override
    public Optional<UserInvoicePreferences> findByUserEmail(String userEmail) {
        log.debug("[REPO] Finding preferences userEmail={}", userEmail);
        return jpaRepository.findById(userEmail).map(UserInvoicePreferencesMapper::toDomain);
    }

    @Override
    public UserInvoicePreferences save(UserInvoicePreferences preferences) {
        log.debug("[REPO] Saving preferences userEmail={}", preferences.userEmail());
        UserInvoicePreferencesEntity entity =
                jpaRepository.save(UserInvoicePreferencesMapper.toEntity(preferences));
        return UserInvoicePreferencesMapper.toDomain(entity);
    }
}
