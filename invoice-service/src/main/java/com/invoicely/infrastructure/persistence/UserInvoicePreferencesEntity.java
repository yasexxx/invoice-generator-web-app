package com.invoicely.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "user_invoice_preferences")
@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor
class UserInvoicePreferencesEntity {

    @Id
    @Column(name = "user_email", length = 255, nullable = false)
    private String userEmail;

    @Column(name = "template_id", length = 50, nullable = false)
    private String templateId;

    @Column(name = "paper_size", length = 20, nullable = false)
    private String paperSize;

    @Column(name = "issuer_name", length = 255, nullable = false)
    private String issuerName;

    @Column(name = "issuer_address", columnDefinition = "TEXT", nullable = false)
    private String issuerAddress;

    @Column(name = "tax_percent", precision = 5, scale = 2, nullable = false)
    private BigDecimal taxPercent;

    @Column(name = "discount", precision = 10, scale = 2, nullable = false)
    private BigDecimal discount;

    @Column(name = "signature", columnDefinition = "TEXT", nullable = false)
    private String signature;
}
