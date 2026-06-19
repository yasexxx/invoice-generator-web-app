package com.invoicely.infrastructure.web;

import com.invoicely.application.preferences.GetInvoicePreferencesUseCase;
import com.invoicely.application.preferences.InvoicePreferencesResponse;
import com.invoicely.application.preferences.SaveInvoicePreferencesCommand;
import com.invoicely.application.preferences.SaveInvoicePreferencesUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/settings/invoice/preferences")
@RequiredArgsConstructor
@Slf4j
public class InvoicePreferencesController {

    private static final String USER_EMAIL_HEADER = "X-User-Email";

    private final GetInvoicePreferencesUseCase  getPreferencesUseCase;
    private final SaveInvoicePreferencesUseCase savePreferencesUseCase;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public InvoicePreferencesRestResponse getPreferences(
            @RequestHeader(value = USER_EMAIL_HEADER, defaultValue = "") String userEmail) {
        log.debug("[WEB] GET /api/v1/settings/invoice/preferences userEmail={}", userEmail);
        return toResponse(getPreferencesUseCase.execute(userEmail));
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public InvoicePreferencesRestResponse savePreferences(
            @RequestHeader(value = USER_EMAIL_HEADER, defaultValue = "") String userEmail,
            @Valid @RequestBody SaveInvoicePreferencesRequest request) {
        log.debug("[WEB] PUT /api/v1/settings/invoice/preferences userEmail={}", userEmail);
        return toResponse(savePreferencesUseCase.execute(userEmail, toCommand(request)));
    }

    private SaveInvoicePreferencesCommand toCommand(SaveInvoicePreferencesRequest r) {
        return new SaveInvoicePreferencesCommand(
                toBackendTemplateId(r.templateId()),
                r.paperSize(),
                r.issuerName() != null ? r.issuerName() : "",
                r.issuerAddress() != null ? r.issuerAddress() : "",
                r.taxPercent(),
                r.discount(),
                r.signature() != null ? r.signature() : ""
        );
    }

    private InvoicePreferencesRestResponse toResponse(InvoicePreferencesResponse r) {
        return new InvoicePreferencesRestResponse(
                toFrontendTemplateId(r.templateId()),
                r.paperSize(),
                r.issuerName(),
                r.issuerAddress(),
                r.taxPercent(),
                r.discount(),
                r.signature()
        );
    }

    private static String toBackendTemplateId(String id) {
        return id.toUpperCase().replace('-', '_');
    }

    private static String toFrontendTemplateId(String id) {
        return id.toLowerCase().replace('_', '-');
    }
}
