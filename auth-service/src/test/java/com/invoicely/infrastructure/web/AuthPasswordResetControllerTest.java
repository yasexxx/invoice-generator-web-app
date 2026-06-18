package com.invoicely.infrastructure.web;

import com.invoicely.application.port.EmailPort;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.HashedPassword;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserId;
import com.invoicely.domain.user.UserStatus;
import com.invoicely.infrastructure.persistence.UserRepositoryAdapter;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class AuthPasswordResetControllerTest {

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

    private void seedActiveUser(String email, String rawPassword) {
        HashedPassword hash = new HashedPassword(passwordEncoder.encode(rawPassword));
        userRepository.save(User.reconstitute(
                UserId.generate(), new Email(email), hash,
                UserStatus.ACTIVE, Instant.now(), Instant.now()));
    }

    private HttpEntity<String> jsonBody(String json) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(json, headers);
    }

    @Test
    void forgotPassword_withExistingEmail_returns200() {
        seedActiveUser("forgot@example.com", "securepass");

        ResponseEntity<Void> response = restTemplate.postForEntity(
                "/api/auth/forgot-password",
                jsonBody("{\"email\":\"forgot@example.com\"}"),
                Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void forgotPassword_withUnknownEmail_stillReturns200() {
        ResponseEntity<Void> response = restTemplate.postForEntity(
                "/api/auth/forgot-password",
                jsonBody("{\"email\":\"ghost@example.com\"}"),
                Void.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void forgotPassword_withInvalidEmail_returns422() {
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/auth/forgot-password",
                jsonBody("{\"email\":\"not-an-email\"}"),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    void resetPassword_withValidToken_returns200AndAllowsLoginWithNewPassword() {
        seedActiveUser("resetflow@example.com", "oldpassword");

        restTemplate.postForEntity("/api/auth/forgot-password",
                jsonBody("{\"email\":\"resetflow@example.com\"}"), Void.class);

        ArgumentCaptor<String> tokenCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailPort).sendPasswordReset(any(Email.class), tokenCaptor.capture());
        String rawToken = tokenCaptor.getValue();
        Mockito.clearInvocations(emailPort);

        ResponseEntity<Void> resetResp = restTemplate.postForEntity(
                "/api/auth/reset-password",
                jsonBody("{\"token\":\"" + rawToken + "\",\"newPassword\":\"newpassword1\"}"),
                Void.class);
        assertThat(resetResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        ResponseEntity<LoginRestResponse> loginResp = restTemplate.postForEntity(
                "/api/auth/login",
                jsonBody("{\"email\":\"resetflow@example.com\",\"password\":\"newpassword1\"}"),
                LoginRestResponse.class);
        assertThat(loginResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginResp.getBody().accessToken()).isNotBlank();
    }

    @Test
    void resetPassword_withUnknownToken_returns400() {
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/auth/reset-password",
                jsonBody("{\"token\":\"unknowntoken\",\"newPassword\":\"newpassword1\"}"),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void resetPassword_withShortPassword_returns422() {
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/api/auth/reset-password",
                jsonBody("{\"token\":\"anytoken\",\"newPassword\":\"short\"}"),
                String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
