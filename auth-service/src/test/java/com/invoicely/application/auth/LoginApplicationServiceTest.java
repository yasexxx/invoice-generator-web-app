package com.invoicely.application.auth;

import com.invoicely.application.port.AuthEventPort;
import com.invoicely.application.port.PasswordEncoderPort;
import com.invoicely.application.port.TokenGeneratorPort;
import com.invoicely.application.port.TokenIssuerPort;
import com.invoicely.domain.token.RefreshToken;
import com.invoicely.domain.token.TokenRepository;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.HashedPassword;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserId;
import com.invoicely.domain.user.UserRepository;
import com.invoicely.domain.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoginApplicationServiceTest {

    @Mock UserRepository      userRepository;
    @Mock TokenRepository     tokenRepository;
    @Mock PasswordEncoderPort passwordEncoderPort;
    @Mock TokenGeneratorPort  tokenGeneratorPort;
    @Mock TokenIssuerPort     tokenIssuerPort;
    @Mock AuthEventPort       eventPort;

    LoginApplicationService service;

    private static final String RAW_PASSWORD = "securepass";
    private static final String ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.stub";

    @BeforeEach
    void setUp() {
        service = new LoginApplicationService(
                userRepository, tokenRepository,
                passwordEncoderPort, tokenGeneratorPort,
                tokenIssuerPort, eventPort);
    }

    private User activeUser() {
        UserId id = UserId.generate();
        return User.reconstitute(id, new Email("user@example.com"),
                new HashedPassword("$2a$10$hash"), UserStatus.ACTIVE,
                Instant.now(), Instant.now());
    }

    private User pendingUser() {
        UserId id = UserId.generate();
        return User.reconstitute(id, new Email("user@example.com"),
                new HashedPassword("$2a$10$hash"), UserStatus.PENDING_VERIFICATION,
                Instant.now(), Instant.now());
    }

    @Test
    void execute_login_withValidCredentials_returnsAuthTokens() {
        User user = activeUser();
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(user));
        when(passwordEncoderPort.matches(RAW_PASSWORD, user.hashedPassword())).thenReturn(true);
        when(tokenGeneratorPort.generateSecureToken()).thenReturn("rawrefreshtoken");
        when(tokenIssuerPort.issueAccessToken(user.id(), user.email())).thenReturn(ACCESS_TOKEN);

        AuthTokens result = service.execute(new LoginCommand("user@example.com", RAW_PASSWORD));

        assertThat(result.accessToken()).isEqualTo(ACCESS_TOKEN);
        assertThat(result.rawRefreshToken()).isEqualTo("rawrefreshtoken");
    }

    @Test
    void execute_login_withValidCredentials_revokesExistingRefreshTokens() {
        User user = activeUser();
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(user));
        when(passwordEncoderPort.matches(RAW_PASSWORD, user.hashedPassword())).thenReturn(true);
        when(tokenGeneratorPort.generateSecureToken()).thenReturn("rawrefreshtoken");
        when(tokenIssuerPort.issueAccessToken(any(), any())).thenReturn(ACCESS_TOKEN);

        service.execute(new LoginCommand("user@example.com", RAW_PASSWORD));

        verify(tokenRepository).revokeAllRefreshTokensForUser(user.id());
    }

    @Test
    void execute_login_withUnknownEmail_throwsInvalidCredentialsException() {
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.empty());

        assertThatExceptionOfType(InvalidCredentialsException.class)
                .isThrownBy(() -> service.execute(new LoginCommand("ghost@example.com", RAW_PASSWORD)));

        verify(tokenRepository, never()).saveRefreshToken(any());
    }

    @Test
    void execute_login_withWrongPassword_throwsInvalidCredentialsException() {
        User user = activeUser();
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(user));
        when(passwordEncoderPort.matches(any(), any())).thenReturn(false);

        assertThatExceptionOfType(InvalidCredentialsException.class)
                .isThrownBy(() -> service.execute(new LoginCommand("user@example.com", "wrongpass")));
    }

    @Test
    void execute_login_withUnverifiedEmail_throwsEmailNotVerifiedException() {
        User pending = pendingUser();
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(pending));
        when(passwordEncoderPort.matches(RAW_PASSWORD, pending.hashedPassword())).thenReturn(true);

        assertThatExceptionOfType(EmailNotVerifiedException.class)
                .isThrownBy(() -> service.execute(new LoginCommand("user@example.com", RAW_PASSWORD)));
    }

    @Test
    void execute_refresh_withValidToken_returnsNewAuthTokens() {
        User user = activeUser();
        RefreshToken stored = new RefreshToken("somehash", user.id());
        when(tokenRepository.findRefreshTokenByHash(any())).thenReturn(Optional.of(stored));
        when(userRepository.findById(user.id())).thenReturn(Optional.of(user));
        when(tokenGeneratorPort.generateSecureToken()).thenReturn("newrawtoken");
        when(tokenIssuerPort.issueAccessToken(user.id(), user.email())).thenReturn(ACCESS_TOKEN);

        AuthTokens result = service.execute(new RefreshCommand("anything"));

        assertThat(result.accessToken()).isEqualTo(ACCESS_TOKEN);
        assertThat(result.rawRefreshToken()).isEqualTo("newrawtoken");
    }

    @Test
    void execute_refresh_withExpiredToken_throwsInvalidTokenException() {
        UserId userId = UserId.generate();
        RefreshToken expired = RefreshToken.reconstitute("hash", userId, Instant.now().minusSeconds(1L), false);
        when(tokenRepository.findRefreshTokenByHash(any())).thenReturn(Optional.of(expired));

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> service.execute(new RefreshCommand("anything")));
    }

    @Test
    void execute_refresh_withRevokedToken_throwsInvalidTokenException() {
        UserId userId = UserId.generate();
        RefreshToken revoked = RefreshToken.reconstitute("hash", userId, Instant.now().plusSeconds(3600L), true);
        when(tokenRepository.findRefreshTokenByHash(any())).thenReturn(Optional.of(revoked));

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> service.execute(new RefreshCommand("anything")));
    }

    @Test
    void execute_logout_withValidToken_revokesToken() {
        UserId userId = UserId.generate();
        RefreshToken valid = new RefreshToken("somehash", userId);
        when(tokenRepository.findRefreshTokenByHash(any())).thenReturn(Optional.of(valid));

        service.execute(new LogoutCommand("anything"));

        verify(tokenRepository).saveRefreshToken(any(RefreshToken.class));
    }

    @Test
    void execute_logout_withUnknownToken_doesNotThrow() {
        when(tokenRepository.findRefreshTokenByHash(any())).thenReturn(Optional.empty());

        assertThatNoException().isThrownBy(() -> service.execute(new LogoutCommand("unknowntoken")));
    }
}
