package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.token.PasswordResetToken;
import com.invoicely.domain.token.TokenRepository;
import com.invoicely.domain.token.VerificationToken;
import com.invoicely.domain.user.UserId;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class TokenRepositoryAdapter implements TokenRepository {

    private final VerificationTokenJpaRepository  verificationJpaRepository;
    private final PasswordResetTokenJpaRepository resetJpaRepository;

    @Override
    public void saveVerificationToken(VerificationToken token) {
        log.debug("[REPO] Saving verification token for userId={}", token.userId().value());
        verificationJpaRepository.save(TokenMapper.toEntity(token));
    }

    @Override
    public Optional<VerificationToken> findVerificationTokenByHash(String tokenHash) {
        return verificationJpaRepository.findById(tokenHash)
                .map(TokenMapper::toVerificationDomain);
    }

    @Override
    public void revokeVerificationTokensForUser(UserId userId) {
        log.debug("[REPO] Revoking verification tokens for userId={}", userId.value());
        verificationJpaRepository.deleteByUserId(userId.value());
    }

    @Override
    public void savePasswordResetToken(PasswordResetToken token) {
        log.debug("[REPO] Saving password reset token for userId={}", token.userId().value());
        resetJpaRepository.save(TokenMapper.toEntity(token));
    }

    @Override
    public Optional<PasswordResetToken> findPasswordResetTokenByHash(String tokenHash) {
        return resetJpaRepository.findById(tokenHash)
                .map(TokenMapper::toPasswordResetDomain);
    }

    @Override
    public void revokePasswordResetTokensForUser(UserId userId) {
        log.debug("[REPO] Revoking password reset tokens for userId={}", userId.value());
        resetJpaRepository.deleteByUserId(userId.value());
    }
}
