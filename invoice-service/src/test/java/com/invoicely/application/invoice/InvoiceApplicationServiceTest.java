package com.invoicely.application.invoice;

import com.invoicely.application.port.InvoiceEventPort;
import com.invoicely.domain.invoice.Invoice;
import com.invoicely.domain.invoice.InvoiceRepository;
import com.invoicely.domain.invoice.LineItem;
import com.invoicely.domain.invoice.TemplateId;
import com.invoicely.domain.invoice.events.InvoiceDraftedEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvoiceApplicationServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private InvoiceEventPort eventPort;

    @InjectMocks
    private InvoiceApplicationService service;

    @BeforeEach
    void setUp() {
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void execute_returnsResponseWithCorrectTotals() {
        // subtotal = 1×100 = 100, tax = 100×10% = 10, total = 110
        CreateInvoiceCommand command = command(
                List.of(new LineItemCommand("Dev work", 1, new BigDecimal("100.00"))),
                new BigDecimal("10"), BigDecimal.ZERO
        );

        InvoiceResponse response = service.execute(command);

        assertThat(response.invoiceId()).isNotNull();
        assertThat(response.totals().subtotal()).isEqualByComparingTo("100.00");
        assertThat(response.totals().taxAmount()).isEqualByComparingTo("10.00");
        assertThat(response.totals().total()).isEqualByComparingTo("110.00");
    }

    @Test
    void execute_persistsInvoiceThroughRepository() {
        service.execute(command(List.of(), BigDecimal.ZERO, BigDecimal.ZERO));

        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void execute_publishesInvoiceDraftedEvent() {
        service.execute(command(List.of(), BigDecimal.ZERO, BigDecimal.ZERO));

        verify(eventPort).publish(any(InvoiceDraftedEvent.class));
    }

    @Test
    void execute_publishedEventCarriesClientEmail() {
        service.execute(command(List.of(), BigDecimal.ZERO, BigDecimal.ZERO));

        ArgumentCaptor<InvoiceDraftedEvent> captor = ArgumentCaptor.forClass(InvoiceDraftedEvent.class);
        verify(eventPort).publish(captor.capture());
        assertThat(captor.getValue().clientEmail()).isEqualTo("acme@example.com");
    }

    @Test
    void execute_assignsUniqueUuidsToLineItems() {
        List<LineItemCommand> items = List.of(
                new LineItemCommand("Design", 1, BigDecimal.TEN),
                new LineItemCommand("Dev",    2, BigDecimal.ONE)
        );

        ArgumentCaptor<Invoice> captor = ArgumentCaptor.forClass(Invoice.class);
        service.execute(command(items, BigDecimal.ZERO, BigDecimal.ZERO));
        verify(invoiceRepository).save(captor.capture());

        List<UUID> ids = captor.getValue().lineItems().stream()
                .map(LineItem::id)
                .toList();
        assertThat(ids).doesNotHaveDuplicates();
    }

    @Test
    void execute_withNoLineItems_returnsTotalsOfZero() {
        InvoiceResponse response = service.execute(
                command(List.of(), BigDecimal.ZERO, BigDecimal.ZERO)
        );

        assertThat(response.totals().total()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    private CreateInvoiceCommand command(
            List<LineItemCommand> items, BigDecimal taxPercent, BigDecimal discount) {
        return new CreateInvoiceCommand(
                TemplateId.MINIMALIST, "ACME Corp", "acme@example.com",
                "123 Main St", items, taxPercent, discount, "Notes"
        );
    }
}
