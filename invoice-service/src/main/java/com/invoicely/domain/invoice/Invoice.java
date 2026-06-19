package com.invoicely.domain.invoice;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class Invoice {

    private final UUID           id;
    private final String         userEmail;
    private final String         invoiceNumber;
    private final TemplateId     templateId;
    private final String         clientName;
    private final String         clientEmail;
    private final String         clientAddress;
    private final List<LineItem> lineItems;
    private final BigDecimal     taxPercent;
    private final BigDecimal     discount;
    private final String         notes;
    private final Instant        createdAt;

    public Invoice(
            UUID id,
            String userEmail,
            String invoiceNumber,
            TemplateId templateId,
            String clientName,
            String clientEmail,
            String clientAddress,
            List<LineItem> lineItems,
            BigDecimal taxPercent,
            BigDecimal discount,
            String notes) {
        this(id, userEmail, invoiceNumber, templateId, clientName, clientEmail,
             clientAddress, lineItems, taxPercent, discount, notes, Instant.now());
    }

    private Invoice(
            UUID id,
            String userEmail,
            String invoiceNumber,
            TemplateId templateId,
            String clientName,
            String clientEmail,
            String clientAddress,
            List<LineItem> lineItems,
            BigDecimal taxPercent,
            BigDecimal discount,
            String notes,
            Instant createdAt) {
        Objects.requireNonNull(id,          "id");
        Objects.requireNonNull(templateId,  "templateId");
        Objects.requireNonNull(clientEmail, "clientEmail");
        Objects.requireNonNull(lineItems,   "lineItems");
        Objects.requireNonNull(taxPercent,  "taxPercent");
        Objects.requireNonNull(discount,    "discount");
        if (clientName == null || clientName.isBlank()) {
            throw new IllegalArgumentException("clientName must not be blank");
        }
        this.id            = id;
        this.userEmail     = userEmail     != null ? userEmail     : "";
        this.invoiceNumber = invoiceNumber != null ? invoiceNumber : "";
        this.templateId    = templateId;
        this.clientName    = clientName.strip();
        this.clientEmail   = clientEmail;
        this.clientAddress = clientAddress != null ? clientAddress : "";
        this.lineItems     = List.copyOf(lineItems);
        this.taxPercent    = taxPercent;
        this.discount      = discount;
        this.notes         = notes != null ? notes : "";
        this.createdAt     = createdAt;
    }

    public static Invoice reconstitute(
            UUID id,
            String userEmail,
            String invoiceNumber,
            TemplateId templateId,
            String clientName,
            String clientEmail,
            String clientAddress,
            List<LineItem> lineItems,
            BigDecimal taxPercent,
            BigDecimal discount,
            String notes,
            Instant createdAt) {
        return new Invoice(id, userEmail, invoiceNumber, templateId, clientName, clientEmail,
                           clientAddress, lineItems, taxPercent, discount, notes, createdAt);
    }

    public InvoiceTotals calculateTotals() {
        BigDecimal subtotal = lineItems.stream()
                .map(LineItem::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal taxAmount = subtotal
                .multiply(taxPercent)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(taxAmount).subtract(discount)
                .max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);
        return new InvoiceTotals(subtotal, taxAmount, total);
    }

    public UUID           id()            { return id; }
    public String         userEmail()     { return userEmail; }
    public String         invoiceNumber() { return invoiceNumber; }
    public TemplateId     templateId()    { return templateId; }
    public String         clientName()    { return clientName; }
    public String         clientEmail()   { return clientEmail; }
    public String         clientAddress() { return clientAddress; }
    public List<LineItem> lineItems()     { return lineItems; }
    public BigDecimal     taxPercent()    { return taxPercent; }
    public BigDecimal     discount()      { return discount; }
    public String         notes()         { return notes; }
    public Instant        createdAt()     { return createdAt; }
}
