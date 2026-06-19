package com.invoicely.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

interface UserInvoicePreferencesJpaRepository extends JpaRepository<UserInvoicePreferencesEntity, String> {
}
