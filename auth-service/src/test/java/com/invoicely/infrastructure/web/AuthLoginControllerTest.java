package com.invoicely.infrastructure.web;

import com.invoicely.application.port.EmailPort;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.HashedPassword;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserId;
import com.invoicely.domain.user.UserStatus;
import com.invoicely.infrastructure.persistence.UserRepositoryAdapter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class AuthLoginControllerTest {

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

    @MockBean  EmailPort             emailPort;
    @Autowired TestRestTemplate      restTemplate;
    @Autowired UserRepositoryAdapter userRepository;
    @Autowired PasswordEncoder       passwordEncoder;

    private void seedVerifiedUser(String email, String rawPassword) {
        HashedPassword hash = new HashedPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(User.reconstitute(
                UserId.generate(), new Email(email), hash,
                UserStatus.ACTIVE, Instant.now(), Instant.now()));
    }

    private void seedPendingUser(String email, String rawPassword) {
        HashedPassword hash = new HashedPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(User.reconstitute(
                UserId.generate(), new Email(email), hash,
                UserStatus.PENDING_VERIFICATION, Instant.now(), Instant.now()));
    }

    private HttpEntity<String> jsonBody(String json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(json, headers);
    }

    private ResponseEntity<LoginRestResponse> doLogin(String email, String password) {
        return restTemplate.postForEntity(
                "/api/auth/login",
                jsonBody("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"),
                LoginRestResponse.class);
    }

    private String extractCookieValue(String setCookieHeader, String cookieName) {
        if (setCookieHeader == null) return "";
        for (String part : setCookieHeader.split(";")) {
            String trimmed = part.trim();
            if (trimmed.startsWith(cookieName + "=")) {
                return trimmed.substring(cookieName.length() + 1);
            }
        }
        return "";
    }

    @Test
    void login_withValidCredentials_returns200AndAccessToken() {
        seedVerifiedUser("login-ok@example.com", "securepass");

        ResponseEntity<LoginRestResponse> response = doLogin("login-ok@example.com", "securepass");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().accessToken()).isNotBlank();
    }

    @Test
    void login_withValidCredentials_setsHttpOnlyRefreshCookie() {
        seedVerifiedUser("login-cookie@example.com", "securepass");

        ResponseEntity<LoginRestResponse> response = doLogin("login-cookie@example.com", "securepass");

        String setCookie = response.getHeaders().getFirst("Set-Cookie");
        assertThat(setCookie).contains("rt=");
        assertThat(setCookie).containsIgnoringCase("HttpOnly");
    }

    @Test
    void login_withWrongPassword_returns401() {
        seedVerifiedUser("login-bad@example.com", "securepass");

        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/auth/login",
                jsonBody("{\"email\":\"login-bad@example.com\",\"password\":\"wrongpass\"}"),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void login_withUnverifiedEmail_returns403() {
        seedPendingUser("login-pending@example.com", "securepass");

        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/auth/login",
                jsonBody("{\"email\":\"login-pending@example.com\",\"password\":\"securepass\"}"),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void refresh_withValidCookie_returns200AndNewAccessToken() {
        seedVerifiedUser("refresh@example.com", "securepass");
        ResponseEntity<LoginRestResponse> loginResp = doLogin("refresh@example.com", "securepass");
        String setCookie    = loginResp.getHeaders().getFirst("Set-Cookie");
        String cookieValue  = extractCookieValue(setCookie, "rt");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.COOKIE, "rt=" + cookieValue);
        ResponseEntity<LoginRestResponse> refreshResp = restTemplate.exchange(
                "/api/auth/refresh", HttpMethod.POST,
                new HttpEntity<>(headers), LoginRestResponse.class);

        assertThat(refreshResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(refreshResp.getBody()).isNotNull();
        assertThat(refreshResp.getBody().accessToken()).isNotBlank();
    }

    @Test
    void logout_withValidCookie_returns204() {
        seedVerifiedUser("logout@example.com", "securepass");
        ResponseEntity<LoginRestResponse> loginResp = doLogin("logout@example.com", "securepass");
        String setCookie   = loginResp.getHeaders().getFirst("Set-Cookie");
        String cookieValue = extractCookieValue(setCookie, "rt");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.COOKIE, "rt=" + cookieValue);
        ResponseEntity<Void> logoutResp = restTemplate.exchange(
                "/api/auth/logout", HttpMethod.POST,
                new HttpEntity<>(headers), Void.class);

        assertThat(logoutResp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    @Test
    void refresh_withMissingCookie_returns400() {
        ResponseEntity<String> response = restTemplate.exchange(
                "/api/auth/refresh", HttpMethod.POST,
                new HttpEntity<>(new HttpHeaders()), String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
