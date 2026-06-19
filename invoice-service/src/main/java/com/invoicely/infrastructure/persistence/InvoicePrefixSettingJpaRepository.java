package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface InvoicePrefixSettingJpaRepository extends JpaRepository<InvoicePrefixSettingEntity, UUID> {

    List<InvoicePrefixSettingEntity> findByUserEmail(String userEmail);

    Optional<InvoicePrefixSettingEntity> findByUserEmailAndSelectedTrue(String userEmail);

    boolean existsByUserEmailAndPrefix(String userEmail, String prefix);

    @Modifying
    @Query("UPDATE InvoicePrefixSettingEntity e SET e.selected = false WHERE e.userEmail = :userEmail")
    void clearSelectionForUser(@Param("userEmail") String userEmail);
}
