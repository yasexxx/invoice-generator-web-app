package com.invoicely.domain.invoice;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class InvoiceTest {

    private static final UUID ID = UUID.randomUUID();

    @Test
    void calculateTotals_withItemsTaxAndDiscount() {
        List<LineItem> items = List.of(
            new LineItem(UUID.randomUUID(), "Design",      2, new BigDecimal("50.00")),
            new LineItem(UUID.randomUUID(), "Development", 5, new BigDecimal("100.00"))
        );
        // subtotal = (2×50) + (5×100) = 600.00
        // tax      = 600.00 × 10%     =  60.00
        // total    = 600.00 + 60.00 − 50.00 = 610.00
        Invoice invoice = invoice(items, "10", "50.00");

        InvoiceTotals totals = invoice.calculateTotals();

        assertThat(totals.subtotal()).isEqualByComparingTo("600.00");
        assertThat(totals.taxAmount()).isEqualByComparingTo("60.00");
        assertThat(totals.total()).isEqualByComparingTo("610.00");
    }

    @Test
    void calculateTotals_withNoItems_returnsAllZeros() {
        InvoiceTotals totals = invoice(List.of(), "10", "0").calculateTotals();

        assertThat(totals.subtotal()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(totals.taxAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(totals.total()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void calculateTotals_withZeroTax_returnsNoTaxAmount() {
        List<LineItem> items = List.of(
            new LineItem(UUID.randomUUID(), "Item", 3, new BigDecimal("100.00"))
        );
        InvoiceTotals totals = invoice(items, "0", "0").calculateTotals();

        assertThat(totals.taxAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(totals.total()).isEqualByComparingTo("300.00");
    }

    @Test
    void calculateTotals_whenDiscountExceedsTotal_clampsTotalToZero() {
        List<LineItem> items = List.of(
            new LineItem(UUID.randomUUID(), "Item", 1, new BigDecimal("10.00"))
        );
        InvoiceTotals totals = invoice(items, "0", "999.00").calculateTotals();

        assertThat(totals.total()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void constructor_rejectsBlankClientName() {
        assertThatThrownBy(() -> new Invoice(
            ID, TemplateId.MINIMALIST, "  ", "x@example.com",
            "Addr", List.of(), BigDecimal.ZERO, BigDecimal.ZERO, ""
        ))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("clientName");
    }

    @Test
    void constructor_rejectsNullClientName() {
        assertThatThrownBy(() -> new Invoice(
            ID, TemplateId.MINIMALIST, null, "x@example.com",
            "Addr", List.of(), BigDecimal.ZERO, BigDecimal.ZERO, ""
        ))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void lineItems_areImmutable() {
        List<LineItem> mutable = new ArrayList<>();
        mutable.add(new LineItem(UUID.randomUUID(), "A", 1, BigDecimal.TEN));
        Invoice invoice = invoice(mutable, "0", "0");
        mutable.clear();

        assertThat(invoice.lineItems()).hasSize(1);
    }

    @Test
    void lineItems_cannotBeModifiedViaGetter() {
        Invoice invoice = invoice(
            List.of(new LineItem(UUID.randomUUID(), "A", 1, BigDecimal.TEN)),
            "0", "0"
        );

        assertThatThrownBy(() -> invoice.lineItems().add(
            new LineItem(UUID.randomUUID(), "B", 1, BigDecimal.ONE)
        )).isInstanceOf(UnsupportedOperationException.class);
    }

    private Invoice invoice(List<LineItem> items, String taxPercent, String discount) {
        return new Invoice(
            ID, TemplateId.MINIMALIST, "ACME Corp", "acme@example.com",
            "123 Main St", items,
            new BigDecimal(taxPercent), new BigDecimal(discount), "Notes"
        );
    }
}
