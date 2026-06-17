package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

interface InvoiceJpaRepository extends JpaRepository<InvoiceEntity, UUID> {}
