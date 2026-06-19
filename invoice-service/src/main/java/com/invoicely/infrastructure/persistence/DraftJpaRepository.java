package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

interface DraftJpaRepository extends JpaRepository<DraftEntity, UUID> {

    List<DraftEntity> findAllByUserEmail(String userEmail);

    boolean existsByUserEmailAndInvoiceNumberAndIdNot(String userEmail, String invoiceNumber, UUID excludeId);

    boolean existsByUserEmailAndInvoiceNumber(String userEmail, String invoiceNumber);

    @Query("SELECT e.invoiceNumber FROM DraftEntity e WHERE e.userEmail = :userEmail AND e.invoiceNumber <> ''")
    List<String> findInvoiceNumbersByUserEmail(@Param("userEmail") String userEmail);
}
