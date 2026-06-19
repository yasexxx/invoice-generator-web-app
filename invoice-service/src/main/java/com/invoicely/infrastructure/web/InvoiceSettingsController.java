package com.invoicely.infrastructure.web;

import com.invoicely.application.settings.DeletePrefixUseCase;
import com.invoicely.application.settings.GetInvoiceSettingsUseCase;
import com.invoicely.application.settings.InvoiceSettingsResponse;
import com.invoicely.application.settings.SavePrefixUseCase;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settings/invoice")
@RequiredArgsConstructor
@Slf4j
public class InvoiceSettingsController {

    private static final String USER_EMAIL_HEADER = "X-User-Email";

    private final GetInvoiceSettingsUseCase getSettingsUseCase;
    private final SavePrefixUseCase         savePrefixUseCase;
    private final DeletePrefixUseCase       deletePrefixUseCase;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public InvoiceSettingsRestResponse getSettings(
            @RequestHeader(value = USER_EMAIL_HEADER, defaultValue = "") String userEmail) {
        log.debug("[WEB] GET /api/v1/settings/invoice userEmail={}", userEmail);
        return toResponse(getSettingsUseCase.execute(userEmail));
    }

    @PostMapping("/prefixes")
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceSettingsRestResponse.PrefixDto savePrefix(
            @RequestHeader(value = USER_EMAIL_HEADER, defaultValue = "") String userEmail,
            @Valid @RequestBody SavePrefixRequest request) {
        log.debug("[WEB] POST /api/v1/settings/invoice/prefixes prefix={}", request.prefix());
        return toDto(savePrefixUseCase.execute(userEmail, request.prefix()));
    }

    @PutMapping("/prefixes/{id}/select")
    @ResponseStatus(HttpStatus.OK)
    public InvoiceSettingsRestResponse.PrefixDto selectPrefix(
            @RequestHeader(value = USER_EMAIL_HEADER, defaultValue = "") String userEmail,
            @PathVariable UUID id) {
        log.debug("[WEB] PUT /api/v1/settings/invoice/prefixes/{}/select", id);
        return toDto(savePrefixUseCase.select(userEmail, id));
    }

    @DeleteMapping("/prefixes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePrefix(
            @RequestHeader(value = USER_EMAIL_HEADER, defaultValue = "") String userEmail,
            @PathVariable UUID id) {
        log.debug("[WEB] DELETE /api/v1/settings/invoice/prefixes/{}", id);
        deletePrefixUseCase.execute(userEmail, id);
    }

    private InvoiceSettingsRestResponse toResponse(InvoiceSettingsResponse r) {
        List<InvoiceSettingsRestResponse.PrefixDto> dtos = r.prefixes().stream()
                .map(p -> new InvoiceSettingsRestResponse.PrefixDto(p.id(), p.prefix(), p.selected()))
                .toList();
        return new InvoiceSettingsRestResponse(dtos, r.nextInvoiceNumber());
    }

    private InvoiceSettingsRestResponse.PrefixDto toDto(InvoiceSettingsResponse.PrefixDto d) {
        return new InvoiceSettingsRestResponse.PrefixDto(d.id(), d.prefix(), d.selected());
    }
}
