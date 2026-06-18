package com.invoicely.infrastructure.security;

import com.invoicely.application.auth.InvalidTokenException;
import com.invoicely.application.port.TokenIssuerPort;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.UserId;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Component
@Slf4j
public class JwtTokenAdapter implements TokenIssuerPort {

    private static final String CLAIM_EMAIL   = "email";
    private static final long   MS_PER_SECOND = 1_000L;

    private final SecretKey secretKey;
    private final long      accessTokenExpiryMs;

    public JwtTokenAdapter(
            @Value("${jwt.secret}") String base64Secret,
            @Value("${jwt.access-token-expiry-seconds:900}") long expirySeconds) {
        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);
        this.secretKey           = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpiryMs = expirySeconds * MS_PER_SECOND;
    }

    @Override
    public String issueAccessToken(UserId userId, Email email) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpiryMs);
        return Jwts.builder()
                .subject(userId.value().toString())
                .claim(CLAIM_EMAIL, email.value())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    @Override
    public UserId validateAccessToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return new UserId(UUID.fromString(claims.getSubject()));
        } catch (JwtException e) {
            log.debug("[JWT] Token validation failed: {}", e.getMessage());
            throw new InvalidTokenException("Invalid or expired access token");
        }
    }
}
