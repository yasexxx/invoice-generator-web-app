package com.invoicely.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_invoice_settings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
class InvoicePrefixSettingEntity {

    @Id
    private UUID id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "prefix", nullable = false, length = 50)
    private String prefix;

    @Column(name = "is_selected", nullable = false)
    private boolean selected;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
