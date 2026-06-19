package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.draft.Draft;
import com.invoicely.domain.draft.DraftLineItem;

import java.util.List;

final class DraftMapper {

    private DraftMapper() {}

    static DraftEntity toEntity(Draft draft) {
        List<DraftLineItemEmbeddable> lineItems = draft.lineItems().stream()
                .map(li -> new DraftLineItemEmbeddable(li.id(), li.description(), li.qty(), li.rate()))
                .toList();
        return new DraftEntity(
                draft.id(), draft.templateId(), draft.paperSize(), draft.invoiceNumber(),
                draft.issuedDate(), draft.dueDate(), draft.issuerName(), draft.issuerAddress(),
                draft.clientName(), draft.clientEmail(), draft.clientAddress(),
                lineItems, draft.taxPercent(), draft.discount(), draft.notes(),
                draft.signature(), draft.createdAt(), draft.updatedAt()
        );
    }

    static Draft toDomain(DraftEntity entity) {
        List<DraftLineItem> lineItems = entity.getLineItems().stream()
                .map(li -> new DraftLineItem(li.getId(), li.getDescription(), li.getQty(), li.getRate()))
                .toList();
        return Draft.reconstitute(
                entity.getId(), entity.getTemplateId(), entity.getPaperSize(),
                entity.getInvoiceNumber(), entity.getIssuedDate(), entity.getDueDate(),
                entity.getIssuerName(), entity.getIssuerAddress(), entity.getClientName(),
                entity.getClientEmail(), entity.getClientAddress(),
                lineItems, entity.getTaxPercent(), entity.getDiscount(),
                entity.getNotes(), entity.getSignature(),
                entity.getCreatedAt(), entity.getUpdatedAt()
        );
    }
}
