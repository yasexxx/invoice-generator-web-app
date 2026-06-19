package com.invoicely.infrastructure.persistence;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "drafts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
class DraftEntity {

    @Id
    private UUID id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "template_id", nullable = false, length = 20)
    private String templateId;

    @Column(name = "paper_size", nullable = false, length = 20)
    private String paperSize;

    @Column(name = "invoice_number", nullable = false, length = 100)
    private String invoiceNumber;

    @Column(name = "issued_date", nullable = false, length = 50)
    private String issuedDate;

    @Column(name = "due_date", nullable = false, length = 50)
    private String dueDate;

    @Column(name = "issuer_name", nullable = false, length = 255)
    private String issuerName;

    @Column(name = "issuer_address", nullable = false)
    private String issuerAddress;

    @Column(name = "client_name", nullable = false, length = 255)
    private String clientName;

    @Column(name = "client_email", nullable = false, length = 255)
    private String clientEmail;

    @Column(name = "client_address", nullable = false)
    private String clientAddress;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "draft_line_items", joinColumns = @JoinColumn(name = "draft_id"))
    @OrderColumn(name = "item_order")
    private List<DraftLineItemEmbeddable> lineItems;

    @Column(name = "tax_percent", precision = 5, scale = 2, nullable = false)
    private BigDecimal taxPercent;

    @Column(name = "discount", precision = 10, scale = 2, nullable = false)
    private BigDecimal discount;

    @Column(name = "notes", nullable = false)
    private String notes;

    @Column(name = "signature", nullable = false)
    private String signature;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
