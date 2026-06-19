package com.invoicely.application.invoice;

import com.invoicely.application.port.InvoiceEventPort;
import com.invoicely.domain.draft.DraftRepository;
import com.invoicely.domain.invoice.Invoice;
import com.invoicely.domain.invoice.InvoiceRepository;
import com.invoicely.domain.invoice.InvoiceTotals;
import com.invoicely.domain.invoice.LineItem;
import com.invoicely.domain.invoice.events.InvoiceDraftedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceApplicationService implements CreateInvoiceUseCase {

    private final InvoiceRepository invoiceRepository;
    private final DraftRepository   draftRepository;
    private final InvoiceEventPort  eventPort;

    @Override
    @Transactional
    public InvoiceResponse execute(CreateInvoiceCommand command) {
        log.debug("[APP] Creating invoice clientEmail={}", command.clientEmail());
        guardNoDuplicate(command.userEmail(), command.invoiceNumber());

        List<LineItem> lineItems = command.lineItems().stream()
                .map(li -> new LineItem(UUID.randomUUID(), li.description(), li.qty(), li.rate()))
                .toList();

        Invoice invoice = new Invoice(
                UUID.randomUUID(),
                command.userEmail(),
                command.invoiceNumber(),
                command.templateId(),
                command.clientName(),
                command.clientEmail(),
                command.clientAddress(),
                lineItems,
                command.taxPercent(),
                command.discount(),
                command.notes()
        );

        Invoice saved = invoiceRepository.save(invoice);
        InvoiceTotals totals = saved.calculateTotals();

        log.info("[APP] Invoice created id={} total={}", saved.id(), totals.total());

        eventPort.publish(new InvoiceDraftedEvent(saved.id(), saved.clientEmail(), Instant.now()));

        return new InvoiceResponse(saved.id(), totals);
    }

    private void guardNoDuplicate(String userEmail, String invoiceNumber) {
        if (invoiceNumber == null || invoiceNumber.isBlank()) return;
        boolean inInvoices = invoiceRepository.existsByUserEmailAndInvoiceNumber(
                userEmail, invoiceNumber);
        boolean inDrafts   = draftRepository.existsByUserEmailAndInvoiceNumberExcluding(
                userEmail, invoiceNumber, null);
        if (inInvoices || inDrafts) {
            throw new DuplicateInvoiceNumberException(invoiceNumber);
        }
    }
}
