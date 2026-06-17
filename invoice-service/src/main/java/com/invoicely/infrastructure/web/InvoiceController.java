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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class InvoiceController {

    private final CreateInvoiceUseCase createInvoiceUseCase;

    @PostMapping("/invoices")
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceRestResponse createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        log.debug("[WEB] POST /api/v1/invoices clientEmail={}", request.clientEmail());

        InvoiceResponse response = createInvoiceUseCase.execute(toCommand(request));

        return new InvoiceRestResponse(
                response.invoiceId(),
                new InvoiceRestResponse.TotalsDto(
                        response.totals().subtotal(),
                        response.totals().taxAmount(),
                        response.totals().total()
                )
        );
    }

    private CreateInvoiceCommand toCommand(CreateInvoiceRequest request) {
        TemplateId templateId = TemplateId.valueOf(request.templateId().toUpperCase());
        List<LineItemCommand> lineItems = request.lineItems().stream()
                .map(li -> new LineItemCommand(li.description(), li.qty(), li.rate()))
                .toList();
        return new CreateInvoiceCommand(
                templateId, request.clientName(), request.clientEmail(),
                request.clientAddress(), lineItems,
                request.taxPercent(), request.discount(), request.notes()
        );
    }
}
