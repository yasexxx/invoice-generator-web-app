package com.invoicely.infrastructure.security;

import com.invoicely.application.auth.InvalidTokenException;
import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.UserId;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

class JwtTokenAdapterTest {

    private static final SecretKey TEST_KEY     = Jwts.SIG.HS256.key().build();
    private static final String    TEST_SECRET  = Base64.getEncoder().encodeToString(TEST_KEY.getEncoded());
    private static final long      EXPIRY_SECS  = 900L;
    private static final long      PAST_SECS    = -1L;

    private final JwtTokenAdapter adapter = new JwtTokenAdapter(TEST_SECRET, EXPIRY_SECS);

    @Test
    void issueAccessToken_returnsNonBlankJwt() {
        UserId userId = UserId.generate();
        Email  email  = new Email("user@example.com");

        String token = adapter.issueAccessToken(userId, email);

        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    void validateAccessToken_withValidToken_returnsOriginalUserId() {
        UserId userId = UserId.generate();
        Email  email  = new Email("user@example.com");

        String token  = adapter.issueAccessToken(userId, email);
        UserId result = adapter.validateAccessToken(token);

        assertThat(result).isEqualTo(userId);
    }

    @Test
    void validateAccessToken_withExpiredToken_throwsInvalidTokenException() {
        JwtTokenAdapter shortLivedAdapter = new JwtTokenAdapter(TEST_SECRET, PAST_SECS);
        String token = shortLivedAdapter.issueAccessToken(UserId.generate(), new Email("e@x.com"));

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> adapter.validateAccessToken(token));
    }

    @Test
    void validateAccessToken_withTamperedToken_throwsInvalidTokenException() {
        String token    = adapter.issueAccessToken(UserId.generate(), new Email("e@x.com"));
        String tampered = token.substring(0, token.length() - 4) + "XXXX";

        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> adapter.validateAccessToken(tampered));
    }

    @Test
    void validateAccessToken_withRandomString_throwsInvalidTokenException() {
        assertThatExceptionOfType(InvalidTokenException.class)
                .isThrownBy(() -> adapter.validateAccessToken("not.a.jwt"));
    }
}
