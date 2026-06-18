package com.invoicely.domain.token;

import com.invoicely.domain.user.UserId;

import java.time.Instant;
import java.util.Objects;

public class RefreshToken {

    private static final long EXPIRY_DURATION_SECONDS = 2_592_000L; // 30 days

    private final String  tokenHash;
    private final UserId  userId;
    private final Instant expiresAt;
    private final boolean revoked;

    public RefreshToken(String tokenHash, UserId userId) {
        this(tokenHash, userId, Instant.now().plusSeconds(EXPIRY_DURATION_SECONDS), false);
    }

    private RefreshToken(String tokenHash, UserId userId, Instant expiresAt, boolean revoked) {
        Objects.requireNonNull(tokenHash, "tokenHash");
        Objects.requireNonNull(userId,    "userId");
        Objects.requireNonNull(expiresAt, "expiresAt");
        if (tokenHash.isBlank()) {
            throw new IllegalArgumentException("tokenHash must not be blank");
        }
        this.tokenHash = tokenHash;
        this.userId    = userId;
        this.expiresAt = expiresAt;
        this.revoked   = revoked;
    }

    public static RefreshToken reconstitute(
            String tokenHash, UserId userId, Instant expiresAt, boolean revoked) {
        return new RefreshToken(tokenHash, userId, expiresAt, revoked);
    }

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }

    public boolean isRevoked() {
        return revoked;
    }

    public RefreshToken revoke() {
        if (revoked) {
            throw new IllegalStateException("Refresh token is already revoked");
        }
        return new RefreshToken(tokenHash, userId, expiresAt, true);
    }

    public String  tokenHash() { return tokenHash; }
    public UserId  userId()    { return userId; }
    public Instant expiresAt() { return expiresAt; }
}
