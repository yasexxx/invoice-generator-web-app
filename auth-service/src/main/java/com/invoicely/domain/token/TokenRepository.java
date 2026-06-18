package com.invoicely.domain.token;

import com.invoicely.domain.user.UserId;

import java.util.Optional;

public interface TokenRepository {

    void saveVerificationToken(VerificationToken token);

    Optional<VerificationToken> findVerificationTokenByHash(String tokenHash);

    void revokeVerificationTokensForUser(UserId userId);

    void savePasswordResetToken(PasswordResetToken token);

    Optional<PasswordResetToken> findPasswordResetTokenByHash(String tokenHash);

    void revokePasswordResetTokensForUser(UserId userId);
}
