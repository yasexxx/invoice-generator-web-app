package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface DraftJpaRepository extends JpaRepository<DraftEntity, UUID> {}
