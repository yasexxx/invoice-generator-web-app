package com.invoicely.application.draft;

import com.invoicely.application.invoice.DuplicateInvoiceNumberException;
import com.invoicely.domain.draft.Draft;
import com.invoicely.domain.draft.DraftLineItem;
import com.invoicely.domain.draft.DraftRepository;
import com.invoicely.domain.invoice.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DraftApplicationService
        implements CreateDraftUseCase, UpdateDraftUseCase, ListDraftsUseCase,
                   GetDraftUseCase, DeleteDraftUseCase {

    private final DraftRepository   draftRepository;
    private final InvoiceRepository invoiceRepository;

    @Override
    public DraftSummaryResponse execute(SaveDraftCommand command) {
        log.debug("[APP] Creating draft invoiceNumber={}", command.invoiceNumber());
        guardNoDuplicate(command.userEmail(), command.invoiceNumber(), null);
        Draft draft = new Draft(
                UUID.randomUUID(),
                command.userEmail(), command.templateId(), command.paperSize(),
                command.invoiceNumber(), command.issuedDate(), command.dueDate(),
                command.issuerName(), command.issuerAddress(), command.clientName(),
                command.clientEmail(), command.clientAddress(),
                toLineItems(command.lineItems()),
                command.taxPercent(), command.discount(), command.notes(), command.signature()
        );
        Draft saved = draftRepository.save(draft);
        log.info("[APP] Draft created id={}", saved.id());
        return toSummaryResponse(saved);
    }

    @Override
    public DraftSummaryResponse execute(UUID id, SaveDraftCommand command) {
        log.debug("[APP] Updating draft id={}", id);
        Draft existing = draftRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Draft not found: " + id));
        guardNoDuplicate(command.userEmail(), command.invoiceNumber(), id);
        Draft updated = Draft.reconstitute(
                id,
                command.userEmail(), command.templateId(), command.paperSize(),
                command.invoiceNumber(), command.issuedDate(), command.dueDate(),
                command.issuerName(), command.issuerAddress(), command.clientName(),
                command.clientEmail(), command.clientAddress(),
                toLineItems(command.lineItems()),
                command.taxPercent(), command.discount(), command.notes(), command.signature(),
                existing.createdAt(), Instant.now()
        );
        Draft saved = draftRepository.save(updated);
        log.info("[APP] Draft updated id={}", saved.id());
        return toSummaryResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DraftSummaryResponse> execute(String userEmail) {
        log.debug("[APP] Listing drafts userEmail={}", userEmail);
        return draftRepository.findAllByUserEmail(userEmail).stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DraftResponse execute(UUID id) {
        log.debug("[APP] Getting draft id={}", id);
        Draft draft = draftRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Draft not found: " + id));
        return toFullResponse(draft);
    }

    @Override
    public void delete(UUID id) {
        log.debug("[APP] Deleting draft id={}", id);
        draftRepository.deleteById(id);
        log.info("[APP] Draft deleted id={}", id);
    }

    private void guardNoDuplicate(String userEmail, String invoiceNumber, UUID excludeId) {
        if (invoiceNumber == null || invoiceNumber.isBlank()) return;
        boolean inDrafts   = draftRepository.existsByUserEmailAndInvoiceNumberExcluding(
                userEmail, invoiceNumber, excludeId);
        boolean inInvoices = invoiceRepository.existsByUserEmailAndInvoiceNumber(
                userEmail, invoiceNumber);
        if (inDrafts || inInvoices) {
            throw new DuplicateInvoiceNumberException(invoiceNumber);
        }
    }

    private List<DraftLineItem> toLineItems(List<SaveDraftLineItemCommand> commands) {
        return commands.stream()
                .map(c -> new DraftLineItem(UUID.randomUUID(), c.description(), c.qty(), c.rate()))
                .toList();
    }

    private DraftSummaryResponse toSummaryResponse(Draft draft) {
        return new DraftSummaryResponse(draft.id(), draft.invoiceNumber(),
                                        draft.clientName(), draft.updatedAt());
    }

    private DraftResponse toFullResponse(Draft draft) {
        List<DraftResponse.LineItemDto> items = draft.lineItems().stream()
                .map(li -> new DraftResponse.LineItemDto(li.id(), li.description(), li.qty(), li.rate()))
                .toList();
        return new DraftResponse(
                draft.id(), draft.templateId(), draft.paperSize(), draft.invoiceNumber(),
                draft.issuedDate(), draft.dueDate(), draft.issuerName(), draft.issuerAddress(),
                draft.clientName(), draft.clientEmail(), draft.clientAddress(),
                items, draft.taxPercent(), draft.discount(), draft.notes(),
                draft.signature(), draft.updatedAt()
        );
    }
}
