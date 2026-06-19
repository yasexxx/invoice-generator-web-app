package com.invoicely.infrastructure.web;

import com.invoicely.application.draft.CreateDraftUseCase;
import com.invoicely.application.draft.DeleteDraftUseCase;
import com.invoicely.application.draft.DraftResponse;
import com.invoicely.application.draft.DraftSummaryResponse;
import com.invoicely.application.draft.GetDraftUseCase;
import com.invoicely.application.draft.ListDraftsUseCase;
import com.invoicely.application.draft.SaveDraftCommand;
import com.invoicely.application.draft.SaveDraftLineItemCommand;
import com.invoicely.application.draft.UpdateDraftUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/drafts")
@RequiredArgsConstructor
@Slf4j
public class DraftController {

    private final CreateDraftUseCase createDraftUseCase;
    private final UpdateDraftUseCase updateDraftUseCase;
    private final ListDraftsUseCase  listDraftsUseCase;
    private final GetDraftUseCase    getDraftUseCase;
    private final DeleteDraftUseCase deleteDraftUseCase;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DraftSummaryRestResponse createDraft(@Valid @RequestBody SaveDraftRequest request) {
        log.debug("[WEB] POST /api/v1/drafts invoiceNumber={}", request.invoiceNumber());
        return toSummaryResponse(createDraftUseCase.execute(toCommand(request)));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public DraftSummaryRestResponse updateDraft(
            @PathVariable UUID id,
            @Valid @RequestBody SaveDraftRequest request) {
        log.debug("[WEB] PUT /api/v1/drafts/{} invoiceNumber={}", id, request.invoiceNumber());
        return toSummaryResponse(updateDraftUseCase.execute(id, toCommand(request)));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<DraftSummaryRestResponse> listDrafts() {
        log.debug("[WEB] GET /api/v1/drafts");
        return listDraftsUseCase.execute().stream().map(this::toSummaryResponse).toList();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public DraftRestResponse getDraft(@PathVariable UUID id) {
        log.debug("[WEB] GET /api/v1/drafts/{}", id);
        return toFullResponse(getDraftUseCase.execute(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDraft(@PathVariable UUID id) {
        log.debug("[WEB] DELETE /api/v1/drafts/{}", id);
        deleteDraftUseCase.delete(id);
    }

    private SaveDraftCommand toCommand(SaveDraftRequest r) {
        List<SaveDraftLineItemCommand> lineItems = r.lineItems().stream()
                .map(li -> new SaveDraftLineItemCommand(li.description(), li.qty(), li.rate()))
                .toList();
        return new SaveDraftCommand(
                r.templateId(), r.paperSize(), r.invoiceNumber(), r.issuedDate(), r.dueDate(),
                r.issuerName(), r.issuerAddress(), r.clientName(), r.clientEmail(),
                r.clientAddress(), lineItems, r.taxPercent(), r.discount(),
                r.notes(), r.signature()
        );
    }

    private DraftSummaryRestResponse toSummaryResponse(DraftSummaryResponse r) {
        return new DraftSummaryRestResponse(r.draftId(), r.invoiceNumber(), r.clientName(), r.updatedAt());
    }

    private DraftRestResponse toFullResponse(DraftResponse r) {
        List<DraftRestResponse.LineItemDto> items = r.lineItems().stream()
                .map(li -> new DraftRestResponse.LineItemDto(li.id(), li.description(), li.qty(), li.rate()))
                .toList();
        return new DraftRestResponse(
                r.draftId(), r.templateId(), r.paperSize(), r.invoiceNumber(),
                r.issuedDate(), r.dueDate(), r.issuerName(), r.issuerAddress(),
                r.clientName(), r.clientEmail(), r.clientAddress(),
                items, r.taxPercent(), r.discount(), r.notes(), r.signature(), r.updatedAt()
        );
    }
}
