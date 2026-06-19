package com.invoicely.application.preferences;

import com.invoicely.domain.preferences.UserInvoicePreferences;
import com.invoicely.domain.preferences.UserInvoicePreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class InvoicePreferencesApplicationService
        implements GetInvoicePreferencesUseCase, SaveInvoicePreferencesUseCase {

    private static final String     DEFAULT_TEMPLATE   = "MINIMALIST";
    private static final String     DEFAULT_PAPER_SIZE = "a4";
    private static final BigDecimal DEFAULT_TAX        = new BigDecimal("10.00");
    private static final BigDecimal DEFAULT_DISCOUNT   = new BigDecimal("0.00");

    private final UserInvoicePreferencesRepository preferencesRepository;

    @Override
    @Transactional(readOnly = true)
    public InvoicePreferencesResponse execute(String userEmail) {
        log.debug("[APP] Getting invoice preferences userEmail={}", userEmail);
        return preferencesRepository.findByUserEmail(userEmail)
                .map(this::toResponse)
                .orElseGet(this::defaults);
    }

    @Override
    public InvoicePreferencesResponse execute(String userEmail, SaveInvoicePreferencesCommand command) {
        log.debug("[APP] Saving invoice preferences userEmail={}", userEmail);
        UserInvoicePreferences prefs = new UserInvoicePreferences(
                userEmail,
                command.templateId(),
                command.paperSize(),
                command.issuerName(),
                command.issuerAddress(),
                command.taxPercent().setScale(2, RoundingMode.HALF_UP),
                command.discount().setScale(2, RoundingMode.HALF_UP),
                command.signature()
        );
        UserInvoicePreferences saved = preferencesRepository.save(prefs);
        log.info("[APP] Invoice preferences saved userEmail={}", userEmail);
        return toResponse(saved);
    }

    private InvoicePreferencesResponse toResponse(UserInvoicePreferences p) {
        return new InvoicePreferencesResponse(
                p.templateId(), p.paperSize(),
                p.issuerName(), p.issuerAddress(),
                p.taxPercent(), p.discount(), p.signature()
        );
    }

    private InvoicePreferencesResponse defaults() {
        return new InvoicePreferencesResponse(
                DEFAULT_TEMPLATE, DEFAULT_PAPER_SIZE, "", "", DEFAULT_TAX, DEFAULT_DISCOUNT, ""
        );
    }
}
