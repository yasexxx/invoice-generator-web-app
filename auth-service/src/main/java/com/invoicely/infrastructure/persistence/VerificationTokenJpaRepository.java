package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface VerificationTokenJpaRepository extends JpaRepository<VerificationTokenEntity, String> {

    void deleteByUserId(UUID userId);
}
