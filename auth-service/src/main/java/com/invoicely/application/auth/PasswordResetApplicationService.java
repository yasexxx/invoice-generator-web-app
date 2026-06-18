package com.invoicely.application.auth;

import com.invoicely.application.port.AuthEventPort;
import com.invoicely.application.port.EmailPort;
import com.invoicely.application.port.PasswordEncoderPort;
import com.invoicely.application.port.TokenGeneratorPort;
import com.invoicely.domain.token.PasswordResetToken;
import com.invoicely.domain.token.TokenRepository;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserRepository;
import com.invoicely.domain.user.UserStatus;
import com.invoicely.domain.user.events.PasswordResetRequestedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PasswordResetApplicationService
        implements ForgotPasswordUseCase, ResetPasswordUseCase {

    private final UserRepository      userRepository;
    private final TokenRepository     tokenRepository;
    private final PasswordEncoderPort passwordEncoderPort;
    private final TokenGeneratorPort  tokenGeneratorPort;
    private final EmailPort           emailPort;
    private final AuthEventPort       eventPort;

    @Override
    public void execute(ForgotPasswordCommand command) {
        Email email = new Email(command.email());
        log.debug("[APP] Forgot-password request email={}", email.value());

        userRepository.findByEmail(email)
                .filter(u -> u.status() == UserStatus.ACTIVE)
                .ifPresent(user -> sendResetEmail(user, email));
    }

    @Override
    public void execute(ResetPasswordCommand command) {
        log.debug("[APP] Reset-password attempt");
        String tokenHash = TokenHasher.sha256(command.rawToken());

        PasswordResetToken prt = tokenRepository.findPasswordResetTokenByHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Reset token not found"));

        if (prt.isExpired()) {
            throw new InvalidTokenException("Reset token has expired");
        }
        if (prt.isUsed()) {
            throw new InvalidTokenException("Reset token has already been used");
        }

        User user = userRepository.findById(prt.userId())
                .orElseThrow(() -> new InvalidTokenException("User not found"));

        tokenRepository.savePasswordResetToken(prt.markUsed());
        User updated = user.changePassword(passwordEncoderPort.encode(command.newPassword()));
        userRepository.save(updated);
        tokenRepository.revokeAllRefreshTokensForUser(user.id());

        log.info("[APP] Password reset for userId={}", user.id().value());
    }

    private void sendResetEmail(User user, Email email) {
        tokenRepository.revokePasswordResetTokensForUser(user.id());
        String rawToken  = tokenGeneratorPort.generateSecureToken();
        String tokenHash = TokenHasher.sha256(rawToken);
        tokenRepository.savePasswordResetToken(new PasswordResetToken(tokenHash, user.id()));
        emailPort.sendPasswordReset(email, rawToken);
        eventPort.publish(new PasswordResetRequestedEvent(user.id(), email));
        log.info("[APP] Password-reset email sent userId={}", user.id().value());
    }
}
