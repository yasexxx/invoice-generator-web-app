package com.invoicely.application.auth;

import com.invoicely.application.port.AuthEventPort;
import com.invoicely.application.port.EmailPort;
import com.invoicely.application.port.PasswordEncoderPort;
import com.invoicely.application.port.TokenGeneratorPort;
import com.invoicely.domain.token.TokenRepository;
import com.invoicely.domain.token.VerificationToken;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserId;
import com.invoicely.domain.user.UserRepository;
import com.invoicely.domain.user.events.EmailVerifiedEvent;
import com.invoicely.domain.user.events.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthApplicationService implements RegisterUserUseCase, VerifyEmailUseCase {

    private static final String SHA_256 = "SHA-256";

    private final UserRepository      userRepository;
    private final TokenRepository     tokenRepository;
    private final PasswordEncoderPort passwordEncoderPort;
    private final TokenGeneratorPort  tokenGeneratorPort;
    private final EmailPort           emailPort;
    private final AuthEventPort       eventPort;

    @Override
    public void execute(RegisterUserCommand command) {
        Email email = new Email(command.email());
        log.debug("[APP] Registering user email={}", email.value());

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyRegisteredException(email.value());
        }

        User user = new User(
                UserId.generate(),
                email,
                passwordEncoderPort.encode(command.rawPassword())
        );
        User saved = userRepository.save(user);

        String rawToken  = tokenGeneratorPort.generateSecureToken();
        String tokenHash = sha256(rawToken);
        tokenRepository.saveVerificationToken(new VerificationToken(tokenHash, saved.id()));

        emailPort.sendVerification(email, rawToken);
        eventPort.publish(new UserRegisteredEvent(saved.id(), saved.email()));
        log.info("[APP] User registered id={}", saved.id().value());
    }

    @Override
    public void execute(VerifyEmailCommand command) {
        log.debug("[APP] Verifying email token");

        String tokenHash = sha256(command.rawToken());
        VerificationToken vt = tokenRepository.findVerificationTokenByHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Token not found"));

        if (vt.isExpired()) {
            throw new InvalidTokenException("Token has expired");
        }
        if (vt.isUsed()) {
            throw new InvalidTokenException("Token has already been used");
        }

        User user = userRepository.findById(vt.userId())
                .orElseThrow(() -> new InvalidTokenException("User not found"));

        User verified = user.verify();
        userRepository.save(verified);
        tokenRepository.saveVerificationToken(vt.markUsed());

        eventPort.publish(new EmailVerifiedEvent(verified.id(), verified.email()));
        log.info("[APP] Email verified for user id={}", verified.id().value());
    }

    private static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance(SHA_256);
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
