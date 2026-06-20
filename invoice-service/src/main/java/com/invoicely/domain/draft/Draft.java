package com.invoicely.domain.draft;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class Draft {

    private final UUID               id;
    private final String             userEmail;
    private final String             templateId;
    private final String             paperSize;
    private final String             invoiceNumber;
    private final String             issuedDate;
    private final String             dueDate;
    private final String             issuerName;
    private final String             issuerAddress;
    private final String             clientName;
    private final String             clientEmail;
    private final String             clientAddress;
    private final List<DraftLineItem> lineItems;
    private final BigDecimal         taxPercent;
    private final BigDecimal         discount;
    private final String             notes;
    private final String             signature;
    private final Instant            createdAt;
    private final Instant            updatedAt;

    public Draft(
            UUID id,
            String userEmail,
            String templateId,
            String paperSize,
            String invoiceNumber,
            String issuedDate,
            String dueDate,
            String issuerName,
            String issuerAddress,
            String clientName,
            String clientEmail,
            String clientAddress,
            List<DraftLineItem> lineItems,
            BigDecimal taxPercent,
            BigDecimal discount,
            String notes,
            String signature) {
        this(id, userEmail, templateId, paperSize, invoiceNumber, issuedDate, dueDate,
             issuerName, issuerAddress, clientName, clientEmail, clientAddress,
             lineItems, taxPercent, discount, notes, signature,
             Instant.now(), Instant.now());
    }

    private Draft(
            UUID id,
            String userEmail,
            String templateId,
            String paperSize,
            String invoiceNumber,
            String issuedDate,
            String dueDate,
            String issuerName,
            String issuerAddress,
            String clientName,
            String clientEmail,
            String clientAddress,
            List<DraftLineItem> lineItems,
            BigDecimal taxPercent,
            BigDecimal discount,
            String notes,
            String signature,
            Instant createdAt,
            Instant updatedAt) {
        Objects.requireNonNull(id,         "id");
        Objects.requireNonNull(lineItems,  "lineItems");
        Objects.requireNonNull(taxPercent, "taxPercent");
        Objects.requireNonNull(discount,   "discount");
        Objects.requireNonNull(createdAt,  "createdAt");
        Objects.requireNonNull(updatedAt,  "updatedAt");
        this.id            = id;
        this.userEmail     = userEmail     != null ? userEmail     : "";
        this.templateId    = templateId    != null ? templateId    : "";
        this.paperSize     = paperSize     != null ? paperSize     : "";
        this.invoiceNumber = invoiceNumber != null ? invoiceNumber : "";
        this.issuedDate    = issuedDate    != null ? issuedDate    : "";
        this.dueDate       = dueDate       != null ? dueDate       : "";
        this.issuerName    = issuerName    != null ? issuerName    : "";
        this.issuerAddress = issuerAddress != null ? issuerAddress : "";
        this.clientName    = clientName    != null ? clientName    : "";
        this.clientEmail   = clientEmail   != null ? clientEmail   : "";
        this.clientAddress = clientAddress != null ? clientAddress : "";
        this.lineItems     = List.copyOf(lineItems);
        this.taxPercent    = taxPercent;
        this.discount      = discount;
        this.notes         = notes         != null ? notes         : "";
        this.signature     = signature     != null ? signature     : "";
        this.createdAt     = createdAt;
        this.updatedAt     = updatedAt;
    }

    /**
     * Reconstitutes a {@link Draft} from persisted state.
     * Unlike the public constructor, this preserves the original {@code createdAt}
     * and {@code updatedAt} timestamps rather than setting them to the current instant.
     *
     * @param id        persisted aggregate ID
     * @param createdAt original creation timestamp from the database
     * @param updatedAt last-updated timestamp from the database
     */
    public static Draft reconstitute(
            UUID id,
            String userEmail,
            String templateId,
            String paperSize,
            String invoiceNumber,
            String issuedDate,
            String dueDate,
            String issuerName,
            String issuerAddress,
            String clientName,
            String clientEmail,
            String clientAddress,
            List<DraftLineItem> lineItems,
            BigDecimal taxPercent,
            BigDecimal discount,
            String notes,
            String signature,
            Instant createdAt,
            Instant updatedAt) {
        return new Draft(id, userEmail, templateId, paperSize, invoiceNumber, issuedDate, dueDate,
                         issuerName, issuerAddress, clientName, clientEmail, clientAddress,
                         lineItems, taxPercent, discount, notes, signature, createdAt, updatedAt);
    }

    public UUID               id()            { return id; }
    public String             userEmail()     { return userEmail; }
    public String             templateId()    { return templateId; }
    public String             paperSize()     { return paperSize; }
    public String             invoiceNumber() { return invoiceNumber; }
    public String             issuedDate()    { return issuedDate; }
    public String             dueDate()       { return dueDate; }
    public String             issuerName()    { return issuerName; }
    public String             issuerAddress() { return issuerAddress; }
    public String             clientName()    { return clientName; }
    public String             clientEmail()   { return clientEmail; }
    public String             clientAddress() { return clientAddress; }
    public List<DraftLineItem> lineItems()    { return lineItems; }
    public BigDecimal          taxPercent()   { return taxPercent; }
    public BigDecimal          discount()     { return discount; }
    public String              notes()        { return notes; }
    public String              signature()    { return signature; }
    public Instant             createdAt()    { return createdAt; }
    public Instant             updatedAt()    { return updatedAt; }
}
