package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.invoice.Invoice;
import com.invoicely.domain.invoice.LineItem;
import com.invoicely.domain.invoice.TemplateId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.temporal.ChronoUnit;
import static org.assertj.core.api.Assertions.within;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE;

@DataJpaTest
@AutoConfigureTestDatabase(replace = NONE)
@Testcontainers
class InvoiceRepositoryAdapterTest {

    private static final String USER_EMAIL = "user@example.com";

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withNetworkMode("bridge");

    @DynamicPropertySource
    static void overrideDatasource(DynamicPropertyRegistry registry) {
        String ip = postgres.getContainerInfo()
                .getNetworkSettings()
                .getNetworks()
                .get("bridge")
                .getIpAddress();
        registry.add("spring.datasource.url",
                () -> "jdbc:postgresql://" + ip + ":5432/" + postgres.getDatabaseName());
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.url",
                () -> "jdbc:postgresql://" + ip + ":5432/" + postgres.getDatabaseName());
        registry.add("spring.flyway.user", postgres::getUsername);
        registry.add("spring.flyway.password", postgres::getPassword);
    }

    @Autowired
    private InvoiceJpaRepository jpaRepository;

    @Autowired
    private EntityManager entityManager;

    private InvoiceRepositoryAdapter adapter;

    @BeforeEach
    void setUp() {
        adapter = new InvoiceRepositoryAdapter(jpaRepository);
    }

    @Test
    void save_persistsInvoiceAndReturnsWithSameId() {
        Invoice invoice = minimalInvoice();

        Invoice saved = adapter.save(invoice);

        assertThat(saved.id()).isEqualTo(invoice.id());
        assertThat(saved.clientName()).isEqualTo("ACME Corp");
        assertThat(saved.clientEmail()).isEqualTo("acme@example.com");
    }

    @Test
    void save_persistsLineItemsInOrder() {
        List<LineItem> items = List.of(
                new LineItem(UUID.randomUUID(), "Design",      1, new BigDecimal("50.00")),
                new LineItem(UUID.randomUUID(), "Development", 3, new BigDecimal("100.00"))
        );
        Invoice invoice = invoiceWithItems(items);

        Invoice saved = adapter.save(invoice);

        assertThat(saved.lineItems()).hasSize(2);
        assertThat(saved.lineItems().get(0).description()).isEqualTo("Design");
        assertThat(saved.lineItems().get(1).description()).isEqualTo("Development");
    }

    @Test
    void findById_returnsPersistedInvoice() {
        Invoice invoice = minimalInvoice();
        adapter.save(invoice);
        flushAndClear();

        Optional<Invoice> found = adapter.findById(invoice.id());

        assertThat(found).isPresent();
        assertThat(found.get().clientEmail()).isEqualTo("acme@example.com");
        assertThat(found.get().templateId()).isEqualTo(TemplateId.MINIMALIST);
    }

    @Test
    void findById_preservesCreatedAt() {
        Invoice invoice = minimalInvoice();
        adapter.save(invoice);
        flushAndClear();

        Invoice found = adapter.findById(invoice.id()).orElseThrow();

        assertThat(found.createdAt()).isCloseTo(invoice.createdAt(), within(1, ChronoUnit.MICROS));
    }

    @Test
    void findById_returnsEmptyForUnknownId() {
        Optional<Invoice> found = adapter.findById(UUID.randomUUID());

        assertThat(found).isEmpty();
    }

    @Test
    void findById_roundTripsCalculatedTotalsCorrectly() {
        List<LineItem> items = List.of(
                new LineItem(UUID.randomUUID(), "Work", 2, new BigDecimal("100.00"))
        );
        Invoice invoice = new Invoice(
                UUID.randomUUID(), USER_EMAIL, "INV-001", TemplateId.CORPORATE,
                "ACME Corp", "acme@example.com",
                "123 Main St", items, new BigDecimal("10"), new BigDecimal("20.00"), ""
        );
        adapter.save(invoice);
        flushAndClear();

        Invoice found = adapter.findById(invoice.id()).orElseThrow();

        assertThat(found.calculateTotals().total()).isEqualByComparingTo("200.00");
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }

    private Invoice minimalInvoice() {
        return new Invoice(
                UUID.randomUUID(), USER_EMAIL, "INV-001", TemplateId.MINIMALIST,
                "ACME Corp", "acme@example.com",
                "123 Main St", List.of(), BigDecimal.ZERO, BigDecimal.ZERO, ""
        );
    }

    private Invoice invoiceWithItems(List<LineItem> items) {
        return new Invoice(
                UUID.randomUUID(), USER_EMAIL, "INV-002", TemplateId.MINIMALIST,
                "ACME Corp", "acme@example.com",
                "123 Main St", items, BigDecimal.ZERO, BigDecimal.ZERO, ""
        );
    }
}
