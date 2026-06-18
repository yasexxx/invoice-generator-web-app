package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.token.PasswordResetToken;
import com.invoicely.domain.token.RefreshToken;
import com.invoicely.domain.token.VerificationToken;
import com.invoicely.domain.user.UserId;

final class TokenMapper {

    private TokenMapper() {}

    static VerificationTokenEntity toEntity(VerificationToken token) {
        return new VerificationTokenEntity(
                token.tokenHash(),
                token.userId().value(),
                token.expiresAt(),
                token.isUsed()
        );
    }

    static VerificationToken toVerificationDomain(VerificationTokenEntity entity) {
        return VerificationToken.reconstitute(
                entity.getTokenHash(),
                new UserId(entity.getUserId()),
                entity.getExpiresAt(),
                entity.isUsed()
        );
    }

    static PasswordResetTokenEntity toEntity(PasswordResetToken token) {
        return new PasswordResetTokenEntity(
                token.tokenHash(),
                token.userId().value(),
                token.expiresAt(),
                token.isUsed()
        );
    }

    static PasswordResetToken toPasswordResetDomain(PasswordResetTokenEntity entity) {
        return PasswordResetToken.reconstitute(
                entity.getTokenHash(),
                new UserId(entity.getUserId()),
                entity.getExpiresAt(),
                entity.isUsed()
        );
    }

    static RefreshTokenEntity toEntity(RefreshToken token) {
        return new RefreshTokenEntity(
                token.tokenHash(),
                token.userId().value(),
                token.expiresAt(),
                token.isRevoked()
        );
    }

    static RefreshToken toRefreshDomain(RefreshTokenEntity entity) {
        return RefreshToken.reconstitute(
                entity.getTokenHash(),
                new UserId(entity.getUserId()),
                entity.getExpiresAt(),
                entity.isRevoked()
        );
    }
}
