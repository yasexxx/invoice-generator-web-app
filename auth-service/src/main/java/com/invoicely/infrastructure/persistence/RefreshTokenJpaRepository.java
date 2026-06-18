package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface RefreshTokenJpaRepository extends JpaRepository<RefreshTokenEntity, String> {

    void deleteByUserId(UUID userId);
}
