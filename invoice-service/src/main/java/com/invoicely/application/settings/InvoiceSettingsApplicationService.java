package com.invoicely.application.settings;

import com.invoicely.domain.draft.DraftRepository;
import com.invoicely.domain.invoice.InvoiceRepository;
import com.invoicely.domain.settings.InvoicePrefixSetting;
import com.invoicely.domain.settings.UserInvoiceSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class InvoiceSettingsApplicationService
        implements GetInvoiceSettingsUseCase, SavePrefixUseCase, DeletePrefixUseCase {

    private static final String DEFAULT_PREFIX        = "INV-";
    private static final int    DEFAULT_START_NUMBER  = 1;
    private static final int    PAD_WIDTH             = 3;
    private static final String PAD_FORMAT            = "%0" + PAD_WIDTH + "d";

    private final UserInvoiceSettingsRepository settingsRepository;
    private final InvoiceRepository             invoiceRepository;
    private final DraftRepository               draftRepository;

    @Override
    @Transactional(readOnly = true)
    public InvoiceSettingsResponse execute(String userEmail) {
        log.debug("[APP] Getting invoice settings userEmail={}", userEmail);
        List<InvoicePrefixSetting> all = settingsRepository.findByUserEmail(userEmail);
        List<InvoiceSettingsResponse.PrefixDto> dtos = all.stream()
                .map(s -> new InvoiceSettingsResponse.PrefixDto(s.id(), s.prefix(), s.selected()))
                .toList();
        String selectedPrefix = all.stream()
                .filter(InvoicePrefixSetting::selected)
                .map(InvoicePrefixSetting::prefix)
                .findFirst()
                .orElse(DEFAULT_PREFIX);
        String nextNumber = computeNextInvoiceNumber(userEmail, selectedPrefix);
        return new InvoiceSettingsResponse(dtos, nextNumber);
    }

    @Override
    public InvoiceSettingsResponse.PrefixDto execute(String userEmail, String prefix) {
        log.debug("[APP] Saving prefix userEmail={} prefix={}", userEmail, prefix);
        if (settingsRepository.existsByUserEmailAndPrefix(userEmail, prefix)) {
            InvoicePrefixSetting existing = settingsRepository.findByUserEmail(userEmail).stream()
                    .filter(s -> s.prefix().equals(prefix))
                    .findFirst()
                    .orElseThrow();
            return selectAndReturn(userEmail, existing.id());
        }
        settingsRepository.clearSelectionForUser(userEmail);
        InvoicePrefixSetting saved = settingsRepository.save(
                new InvoicePrefixSetting(UUID.randomUUID(), userEmail, prefix, true, Instant.now()));
        log.info("[APP] Prefix saved id={}", saved.id());
        return new InvoiceSettingsResponse.PrefixDto(saved.id(), saved.prefix(), saved.selected());
    }

    @Override
    public InvoiceSettingsResponse.PrefixDto select(String userEmail, UUID prefixId) {
        log.debug("[APP] Selecting prefix id={}", prefixId);
        return selectAndReturn(userEmail, prefixId);
    }

    @Override
    public void execute(String userEmail, UUID prefixId) {
        log.debug("[APP] Deleting prefix id={}", prefixId);
        settingsRepository.deleteById(prefixId);
        log.info("[APP] Prefix deleted id={}", prefixId);
    }

    private InvoiceSettingsResponse.PrefixDto selectAndReturn(String userEmail, UUID prefixId) {
        settingsRepository.clearSelectionForUser(userEmail);
        List<InvoicePrefixSetting> all = settingsRepository.findByUserEmail(userEmail);
        InvoicePrefixSetting target = all.stream()
                .filter(s -> s.id().equals(prefixId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Prefix not found: " + prefixId));
        InvoicePrefixSetting updated = new InvoicePrefixSetting(
                target.id(), target.userEmail(), target.prefix(), true, target.createdAt());
        InvoicePrefixSetting saved = settingsRepository.save(updated);
        return new InvoiceSettingsResponse.PrefixDto(saved.id(), saved.prefix(), saved.selected());
    }

    private String computeNextInvoiceNumber(String userEmail, String prefix) {
        List<String> allNumbers = new ArrayList<>();
        allNumbers.addAll(invoiceRepository.findInvoiceNumbersByUserEmail(userEmail));
        allNumbers.addAll(draftRepository.findInvoiceNumbersByUserEmail(userEmail));
        Pattern pattern = Pattern.compile("^" + Pattern.quote(prefix) + "(\\d+)$");
        int max = allNumbers.stream()
                .map(pattern::matcher)
                .filter(Matcher::matches)
                .mapToInt(m -> Integer.parseInt(m.group(1)))
                .max()
                .orElse(DEFAULT_START_NUMBER - 1);
        return prefix + String.format(PAD_FORMAT, max + 1);
    }
}
