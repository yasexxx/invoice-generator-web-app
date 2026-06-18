package com.invoicely.infrastructure.web;

import com.invoicely.application.port.EmailPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class AuthControllerTest {

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

    @MockBean
    EmailPort emailPort;

    @Autowired
    TestRestTemplate restTemplate;

    private HttpEntity<String> jsonBody(String json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(json, headers);
    }

    @Test
    void register_withValidRequest_returns201() {
        ResponseEntity<Void> response = restTemplate.postForEntity(
                "/api/auth/register",
                jsonBody("""
                        {"email":"newuser@example.com","password":"securepass"}
                        """),
                Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void register_withInvalidEmail_returns422() {
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/auth/register",
                jsonBody("""
                        {"email":"not-an-email","password":"securepass"}
                        """),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    void register_withShortPassword_returns422() {
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/auth/register",
                jsonBody("""
                        {"email":"user@example.com","password":"short"}
                        """),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    void register_withExistingEmail_returns409() {
        String body = """
                {"email":"duplicate@example.com","password":"securepass"}
                """;
        restTemplate.postForEntity("/api/auth/register", jsonBody(body), Void.class);

        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/auth/register", jsonBody(body), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void verifyEmail_withUnknownToken_returns400() {
        ResponseEntity<String> response = restTemplate.getForEntity(
                "/api/auth/verify-email?token=unknowntoken", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
