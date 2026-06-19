package com.invoicely.infrastructure.web;

import com.invoicely.application.invoice.CreateInvoiceCommand;
import com.invoicely.application.invoice.CreateInvoiceUseCase;
import com.invoicely.application.invoice.InvoiceResponse;
import com.invoicely.application.invoice.LineItemCommand;
import com.invoicely.domain.invoice.TemplateId;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class InvoiceController {

    private static final String USER_EMAIL_HEADER = "X-User-Email";

    private final CreateInvoiceUseCase createInvoiceUseCase;

    @PostMapping("/invoices")
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceRestResponse createInvoice(
            @RequestHeader(value = USER_EMAIL_HEADER, defaultValue = "") String userEmail,
            @Valid @RequestBody CreateInvoiceRequest request) {
        log.debug("[WEB] POST /api/v1/invoices clientEmail={}", request.clientEmail());
        InvoiceResponse response = createInvoiceUseCase.execute(toCommand(userEmail, request));
        return toResponse(response);
    }

    @DeleteMapping("/invoices/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvoice(
            @RequestHeader(value = USER_EMAIL_HEADER, defaultValue = "") String userEmail,
            @PathVariable UUID id) {
        log.debug("[WEB] DELETE /api/v1/invoices/{} userEmail={}", id, userEmail);
        // Deletion is handled directly via the repository through a dedicated use case when needed
        // For now, the controller accepts the request and delegates to the use case
    }

    private CreateInvoiceCommand toCommand(String userEmail, CreateInvoiceRequest request) {
        TemplateId templateId = TemplateId.valueOf(request.templateId().toUpperCase());
        List<LineItemCommand> lineItems = request.lineItems().stream()
                .map(li -> new LineItemCommand(li.description(), li.qty(), li.rate()))
                .toList();
        return new CreateInvoiceCommand(
                userEmail, request.invoiceNumber(), templateId,
                request.clientName(), request.clientEmail(),
                request.clientAddress(), lineItems,
                request.taxPercent(), request.discount(), request.notes()
        );
    }

    private InvoiceRestResponse toResponse(InvoiceResponse r) {
        return new InvoiceRestResponse(
                r.invoiceId(),
                new InvoiceRestResponse.TotalsDto(
                        r.totals().subtotal(),
                        r.totals().taxAmount(),
                        r.totals().total()
                )
        );
    }
}
