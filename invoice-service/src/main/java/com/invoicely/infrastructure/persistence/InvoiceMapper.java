package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.invoice.Invoice;
import com.invoicely.domain.invoice.LineItem;

import java.util.List;

final class InvoiceMapper {

    private InvoiceMapper() {}

    static InvoiceEntity toEntity(Invoice invoice) {
        List<LineItemEmbeddable> lineItems = invoice.lineItems().stream()
                .map(li -> new LineItemEmbeddable(li.id(), li.description(), li.qty(), li.rate()))
                .toList();
        return new InvoiceEntity(
                invoice.id(),
                invoice.templateId(),
                invoice.clientName(),
                invoice.clientEmail(),
                invoice.clientAddress(),
                lineItems,
                invoice.taxPercent(),
                invoice.discount(),
                invoice.notes(),
                invoice.createdAt()
        );
    }

    static Invoice toDomain(InvoiceEntity entity) {
        List<LineItem> lineItems = entity.getLineItems().stream()
                .map(li -> new LineItem(li.getId(), li.getDescription(), li.getQty(), li.getRate()))
                .toList();
        return Invoice.reconstitute(
                entity.getId(),
                entity.getTemplateId(),
                entity.getClientName(),
                entity.getClientEmail(),
                entity.getClientAddress(),
                lineItems,
                entity.getTaxPercent(),
                entity.getDiscount(),
                entity.getNotes(),
                entity.getCreatedAt()
        );
    }
}
