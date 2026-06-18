package com.invoicely.application.auth;

import com.invoicely.application.port.AuthEventPort;
import com.invoicely.application.port.EmailPort;
import com.invoicely.application.port.PasswordEncoderPort;
import com.invoicely.application.port.TokenGeneratorPort;
import com.invoicely.domain.token.TokenRepository;
import com.invoicely.domain.token.VerificationToken;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.HashedPassword;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserId;
import com.invoicely.domain.user.UserRepository;
import com.invoicely.domain.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthApplicationServiceTest {

    @Mock UserRepository      userRepository;
    @Mock TokenRepository     tokenRepository;
    @Mock PasswordEncoderPort passwordEncoderPort;
    @Mock TokenGeneratorPort  tokenGeneratorPort;
    @Mock EmailPort           emailPort;
    @Mock AuthEventPort       eventPort;

    AuthApplicationService service;

    @BeforeEach
    void setUp() {
        service = new AuthApplicationService(
                userRepository, tokenRepository,
                passwordEncoderPort, tokenGeneratorPort,
                emailPort, eventPort);
    }

    private void stubHappyPathRegister() {
        when(userRepository.existsByEmail(any(Email.class))).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(passwordEncoderPort.encode(any())).thenReturn(new HashedPassword("$2a$10$hash"));
        when(tokenGeneratorPort.generateSecureToken()).thenReturn("rawtoken123");
    }

    @Test
    void execute_register_withNewEmail_savesUserWithPendingStatus() {
        stubHappyPathRegister();

        service.execute(new RegisterUserCommand("user@example.com", "password123"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().status()).isEqualTo(UserStatus.PENDING_VERIFICATION);
        assertThat(captor.getValue().email().value()).isEqualTo("user@example.com");
    }

    @Test
    void execute_register_withNewEmail_savesVerificationTokenAndSendsEmail() {
        stubHappyPathRegister();

        service.execute(new RegisterUserCommand("user@example.com", "password123"));

        verify(tokenRepository).saveVerificationToken(any(VerificationToken.class));
        verify(emailPort).sendVerification(any(Email.class), any(String.class));
    }

    @Test
    void execute_register_withExistingEmail_throwsEmailAlreadyRegisteredException() {
        when(userRepository.existsByEmail(any(Email.class))).thenReturn(true);

        assertThatExceptionOfType(EmailAlreadyRegisteredException.class)
                .isThrownBy(() -> service.execute(
                        new RegisterUserCommand("user@example.com", "password123")));

        verify(userRepository, never()).save(any());
        verify(emailPort, never()).sendVerification(any(), any());
    }

    @Test
    void execute_verifyEmail_withValidToken_activatesUser() {
        UserId userId = UserId.generate();
        User pending = new User(userId, new Email("user@example.com"),
                new HashedPassword("$2a$10$hash"));
        VerificationToken validToken = new VerificationToken("sha256ofrawtoken", userId);

        when(tokenRepository.findVerificationTokenByHash(any())).thenReturn(Optional.of(validToken));
        when(userRepository.findById(userId)).thenReturn(Optional.of(pending));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        service.execute(new VerifyEmailCommand("rawtoken"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertThat(captor.getValue().status()).isEqualTo(UserStatus.ACTIVE);
    }

    @Test
    void execute_verifyEmail_withExpiredToken_throwsInvalidTokenException() {
        UserId userId = UserId.generate();
        VerificationToken expired = VerificationToken.reconstitute(
                "hash", userId, Instant.now().minusSeconds(1L), false);

        when(tokenRepository.findVerificationTokenByHash(any())).thenReturn(Optional.of(expired));

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> service.execute(new VerifyEmailCommand("rawtoken")));
    }

    @Test
    void execute_verifyEmail_withUsedToken_throwsInvalidTokenException() {
        UserId userId = UserId.generate();
        VerificationToken used = VerificationToken.reconstitute(
                "hash", userId, Instant.now().plusSeconds(3600L), true);

        when(tokenRepository.findVerificationTokenByHash(any())).thenReturn(Optional.of(used));

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> service.execute(new VerifyEmailCommand("rawtoken")));
    }

    @Test
    void execute_verifyEmail_withUnknownToken_throwsInvalidTokenException() {
        when(tokenRepository.findVerificationTokenByHash(any())).thenReturn(Optional.empty());

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> service.execute(new VerifyEmailCommand("unknowntoken")));
    }
}
