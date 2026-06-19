package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

interface InvoiceJpaRepository extends JpaRepository<InvoiceEntity, UUID> {

    boolean existsByUserEmailAndInvoiceNumber(String userEmail, String invoiceNumber);

    @Query("SELECT e.invoiceNumber FROM InvoiceEntity e WHERE e.userEmail = :userEmail AND e.invoiceNumber <> ''")
    List<String> findInvoiceNumbersByUserEmail(@Param("userEmail") String userEmail);
}
