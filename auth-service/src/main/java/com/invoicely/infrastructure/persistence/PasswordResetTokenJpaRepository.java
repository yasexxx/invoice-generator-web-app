package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface PasswordResetTokenJpaRepository extends JpaRepository<PasswordResetTokenEntity, String> {

    void deleteByUserId(UUID userId);
}
