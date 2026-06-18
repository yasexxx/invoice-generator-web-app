package com.invoicely.application.auth;

import com.invoicely.application.port.AuthEventPort;
import com.invoicely.application.port.PasswordEncoderPort;
import com.invoicely.application.port.TokenGeneratorPort;
import com.invoicely.application.port.TokenIssuerPort;
import com.invoicely.domain.token.RefreshToken;
import com.invoicely.domain.token.TokenRepository;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserRepository;
import com.invoicely.domain.user.UserStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class LoginApplicationService implements LoginUseCase, RefreshUseCase, LogoutUseCase {

    private final UserRepository      userRepository;
    private final TokenRepository     tokenRepository;
    private final PasswordEncoderPort passwordEncoderPort;
    private final TokenGeneratorPort  tokenGeneratorPort;
    private final TokenIssuerPort     tokenIssuerPort;
    private final AuthEventPort       eventPort;

    @Override
    public AuthTokens execute(LoginCommand command) {
        Email email = new Email(command.email());
        log.debug("[APP] Login attempt email={}", email.value());

        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoderPort.matches(command.rawPassword(), user.hashedPassword())) {
            throw new InvalidCredentialsException();
        }
        if (user.status() == UserStatus.PENDING_VERIFICATION) {
            throw new EmailNotVerifiedException();
        }
        if (user.status() != UserStatus.ACTIVE) {
            throw new InvalidCredentialsException();
        }

        tokenRepository.revokeAllRefreshTokensForUser(user.id());

        String rawRefreshToken = tokenGeneratorPort.generateSecureToken();
        tokenRepository.saveRefreshToken(new RefreshToken(TokenHasher.sha256(rawRefreshToken), user.id()));

        String accessToken = tokenIssuerPort.issueAccessToken(user.id(), user.email());
        log.info("[APP] Login successful userId={}", user.id().value());
        return new AuthTokens(accessToken, rawRefreshToken);
    }

    @Override
    public AuthTokens execute(RefreshCommand command) {
        log.debug("[APP] Token refresh");
        String tokenHash = TokenHasher.sha256(command.rawRefreshToken());
        RefreshToken stored = tokenRepository.findRefreshTokenByHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        if (stored.isExpired() || stored.isRevoked()) {
            throw new InvalidTokenException("Refresh token is invalid");
        }

        User user = userRepository.findById(stored.userId())
                .orElseThrow(() -> new InvalidTokenException("User not found"));

        tokenRepository.saveRefreshToken(stored.revoke());
        String rawRefreshToken = tokenGeneratorPort.generateSecureToken();
        tokenRepository.saveRefreshToken(new RefreshToken(TokenHasher.sha256(rawRefreshToken), user.id()));

        String accessToken = tokenIssuerPort.issueAccessToken(user.id(), user.email());
        log.info("[APP] Token refreshed userId={}", user.id().value());
        return new AuthTokens(accessToken, rawRefreshToken);
    }

    @Override
    public void execute(LogoutCommand command) {
        log.debug("[APP] Logout");
        String tokenHash = TokenHasher.sha256(command.rawRefreshToken());
        tokenRepository.findRefreshTokenByHash(tokenHash)
                .filter(rt -> !rt.isRevoked())
                .ifPresent(rt -> tokenRepository.saveRefreshToken(rt.revoke()));
        log.info("[APP] Logout completed");
    }
}
