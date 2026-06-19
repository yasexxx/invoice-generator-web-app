package com.invoicely.infrastructure.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class InvoiceControllerTest {

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
    private TestRestTemplate restTemplate;

    @Test
    void createInvoice_validRequest_returns201WithTotals() {
        CreateInvoiceRequest request = validRequest();

        ResponseEntity<InvoiceRestResponse> response =
                restTemplate.postForEntity("/api/v1/invoices", request, InvoiceRestResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().invoiceId()).isNotNull();
        assertThat(response.getBody().totals().total()).isEqualByComparingTo("220.00");
    }

    @Test
    void createInvoice_missingClientName_returns422() {
        CreateInvoiceRequest request = new CreateInvoiceRequest(
                "MINIMALIST", "INV-T-001", null, "client@example.com",
                "123 Main St", List.of(), BigDecimal.ZERO, BigDecimal.ZERO, ""
        );

        ResponseEntity<Map> response =
                restTemplate.postForEntity("/api/v1/invoices", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    void createInvoice_invalidTemplateId_returns400() {
        CreateInvoiceRequest request = new CreateInvoiceRequest(
                "NONEXISTENT", "INV-T-002", "Alice", "alice@example.com",
                "", List.of(), BigDecimal.ZERO, BigDecimal.ZERO, ""
        );

        ResponseEntity<Map> response =
                restTemplate.postForEntity("/api/v1/invoices", request, Map.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    private CreateInvoiceRequest validRequest() {
        CreateInvoiceRequest.LineItemRequest item =
                new CreateInvoiceRequest.LineItemRequest("Design work", 2, new BigDecimal("100.00"));
        return new CreateInvoiceRequest(
                "MINIMALIST", "INV-T-003", "ACME Corp", "acme@example.com",
                "123 Main St", List.of(item),
                new BigDecimal("10"), BigDecimal.ZERO, "Thank you"
        );
    }
}
