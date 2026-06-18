package com.invoicely.domain.token;

import com.invoicely.domain.user.UserId;

import java.time.Instant;
import java.util.Objects;

public class VerificationToken {

    private static final long EXPIRY_DURATION_SECONDS = 86_400L;

    private final String  tokenHash;
    private final UserId  userId;
    private final Instant expiresAt;
    private final boolean used;

    public VerificationToken(String tokenHash, UserId userId) {
        this(tokenHash, userId,
             Instant.now().plusSeconds(EXPIRY_DURATION_SECONDS),
             false);
    }

    private VerificationToken(
            String tokenHash,
            UserId userId,
            Instant expiresAt,
            boolean used) {
        Objects.requireNonNull(tokenHash, "tokenHash");
        Objects.requireNonNull(userId,    "userId");
        Objects.requireNonNull(expiresAt, "expiresAt");
        if (tokenHash.isBlank()) {
            throw new IllegalArgumentException("tokenHash must not be blank");
        }
        this.tokenHash = tokenHash;
        this.userId    = userId;
        this.expiresAt = expiresAt;
        this.used      = used;
    }

    public static VerificationToken reconstitute(
            String tokenHash,
            UserId userId,
            Instant expiresAt,
            boolean used) {
        return new VerificationToken(tokenHash, userId, expiresAt, used);
    }

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }

    public boolean isUsed() {
        return used;
    }

    public VerificationToken markUsed() {
        if (used) {
            throw new IllegalStateException("Token has already been used");
        }
        return new VerificationToken(tokenHash, userId, expiresAt, true);
    }

    public String  tokenHash() { return tokenHash; }
    public UserId  userId()    { return userId; }
    public Instant expiresAt() { return expiresAt; }
}
