package com.invoicely.application.auth;

import com.invoicely.application.port.AuthEventPort;
import com.invoicely.application.port.EmailPort;
import com.invoicely.application.port.PasswordEncoderPort;
import com.invoicely.application.port.TokenGeneratorPort;
import com.invoicely.domain.token.PasswordResetToken;
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

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PasswordResetApplicationServiceTest {

    @Mock UserRepository      userRepository;
    @Mock TokenRepository     tokenRepository;
    @Mock PasswordEncoderPort passwordEncoderPort;
    @Mock TokenGeneratorPort  tokenGeneratorPort;
    @Mock EmailPort           emailPort;
    @Mock AuthEventPort       eventPort;

    PasswordResetApplicationService service;

    @BeforeEach
    void setUp() {
        service = new PasswordResetApplicationService(
                userRepository, tokenRepository,
                passwordEncoderPort, tokenGeneratorPort,
                emailPort, eventPort);
    }

    private User activeUser() {
        return User.reconstitute(UserId.generate(), new Email("user@example.com"),
                new HashedPassword("$2a$10$hash"), UserStatus.ACTIVE,
                Instant.now(), Instant.now());
    }

    private User pendingUser() {
        return User.reconstitute(UserId.generate(), new Email("user@example.com"),
                new HashedPassword("$2a$10$hash"), UserStatus.PENDING_VERIFICATION,
                Instant.now(), Instant.now());
    }

    @Test
    void execute_forgotPassword_withExistingActiveUser_sendsResetEmail() {
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(activeUser()));
        when(tokenGeneratorPort.generateSecureToken()).thenReturn("rawtoken");

        service.execute(new ForgotPasswordCommand("user@example.com"));

        verify(tokenRepository).savePasswordResetToken(any(PasswordResetToken.class));
        verify(emailPort).sendPasswordReset(any(Email.class), any(String.class));
    }

    @Test
    void execute_forgotPassword_withUnknownEmail_doesNotSendEmail() {
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.empty());

        service.execute(new ForgotPasswordCommand("ghost@example.com"));

        verify(emailPort, never()).sendPasswordReset(any(), any());
    }

    @Test
    void execute_forgotPassword_withPendingUser_doesNotSendEmail() {
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.of(pendingUser()));

        service.execute(new ForgotPasswordCommand("user@example.com"));

        verify(emailPort, never()).sendPasswordReset(any(), any());
    }

    @Test
    void execute_resetPassword_withValidToken_updatesUserPassword() {
        User user = activeUser();
        PasswordResetToken validToken = new PasswordResetToken("somehash", user.id());

        when(tokenRepository.findPasswordResetTokenByHash(any())).thenReturn(Optional.of(validToken));
        when(userRepository.findById(user.id())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(passwordEncoderPort.encode("newpassword")).thenReturn(new HashedPassword("$2a$10$newhash"));

        service.execute(new ResetPasswordCommand("rawtoken", "newpassword"));

        verify(userRepository).save(any(User.class));
    }

    @Test
    void execute_resetPassword_withValidToken_revokesAllRefreshTokens() {
        User user = activeUser();
        PasswordResetToken validToken = new PasswordResetToken("somehash", user.id());

        when(tokenRepository.findPasswordResetTokenByHash(any())).thenReturn(Optional.of(validToken));
        when(userRepository.findById(user.id())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(passwordEncoderPort.encode(any())).thenReturn(new HashedPassword("$2a$10$newhash"));

        service.execute(new ResetPasswordCommand("rawtoken", "newpassword"));

        verify(tokenRepository).revokeAllRefreshTokensForUser(user.id());
    }

    @Test
    void execute_resetPassword_withExpiredToken_throwsInvalidTokenException() {
        UserId userId = UserId.generate();
        PasswordResetToken expired = PasswordResetToken.reconstitute(
                "hash", userId, Instant.now().minusSeconds(1L), false);

        when(tokenRepository.findPasswordResetTokenByHash(any())).thenReturn(Optional.of(expired));

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> service.execute(new ResetPasswordCommand("rawtoken", "newpass1")));
    }

    @Test
    void execute_resetPassword_withUsedToken_throwsInvalidTokenException() {
        UserId userId = UserId.generate();
        PasswordResetToken used = PasswordResetToken.reconstitute(
                "hash", userId, Instant.now().plusSeconds(600L), true);

        when(tokenRepository.findPasswordResetTokenByHash(any())).thenReturn(Optional.of(used));

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> service.execute(new ResetPasswordCommand("rawtoken", "newpass1")));
    }

    @Test
    void execute_resetPassword_withUnknownToken_throwsInvalidTokenException() {
        when(tokenRepository.findPasswordResetTokenByHash(any())).thenReturn(Optional.empty());

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> service.execute(new ResetPasswordCommand("unknown", "newpass1")));
    }

    @Test
    void execute_forgotPassword_withAnyEmail_doesNotThrow() {
        when(userRepository.findByEmail(any(Email.class))).thenReturn(Optional.empty());

        assertThatNoException()
                .isThrownBy(() -> service.execute(new ForgotPasswordCommand("any@example.com")));
    }
}
