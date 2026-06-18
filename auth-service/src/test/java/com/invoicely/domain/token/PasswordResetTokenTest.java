package com.invoicely.domain.token;

import com.invoicely.domain.user.UserId;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;
import static org.assertj.core.api.Assertions.assertThatNullPointerException;

class PasswordResetTokenTest {

    private static final String HASH    = "sha256hashvalue";
    private static final UserId USER_ID = UserId.generate();

    @Test
    void constructor_setsExpiryToTenMinutesFromNow() {
        Instant before = Instant.now();

        PasswordResetToken token = new PasswordResetToken(HASH, USER_ID);

        Instant expectedExpiry = before.plusSeconds(600L);
        assertThat(token.expiresAt())
                .isAfterOrEqualTo(expectedExpiry.minusSeconds(2L))
                .isBeforeOrEqualTo(expectedExpiry.plusSeconds(2L));
    }

    @Test
    void constructor_withNullTokenHash_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new PasswordResetToken(null, USER_ID))
                .withMessageContaining("tokenHash");
    }

    @Test
    void constructor_withBlankTokenHash_throwsIllegalArgumentException() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> new PasswordResetToken("  ", USER_ID));
    }

    @Test
    void constructor_withNullUserId_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new PasswordResetToken(HASH, null))
                .withMessageContaining("userId");
    }

    @Test
    void isExpired_whenExpiryIsInPast_returnsTrue() {
        PasswordResetToken token = PasswordResetToken.reconstitute(
                HASH, USER_ID, Instant.now().minusSeconds(1L), false);

        assertThat(token.isExpired()).isTrue();
    }

    @Test
    void isExpired_whenExpiryIsInFuture_returnsFalse() {
        PasswordResetToken token = new PasswordResetToken(HASH, USER_ID);

        assertThat(token.isExpired()).isFalse();
    }

    @Test
    void isUsed_onNewToken_returnsFalse() {
        PasswordResetToken token = new PasswordResetToken(HASH, USER_ID);

        assertThat(token.isUsed()).isFalse();
    }

    @Test
    void markUsed_returnsNewTokenWithUsedTrue() {
        PasswordResetToken token = new PasswordResetToken(HASH, USER_ID);

        PasswordResetToken used = token.markUsed();

        assertThat(used.isUsed()).isTrue();
    }

    @Test
    void markUsed_doesNotMutateOriginalToken() {
        PasswordResetToken token = new PasswordResetToken(HASH, USER_ID);

        token.markUsed();

        assertThat(token.isUsed()).isFalse();
    }

    @Test
    void markUsed_preservesTokenHashAndUserId() {
        PasswordResetToken token = new PasswordResetToken(HASH, USER_ID);

        PasswordResetToken used = token.markUsed();

        assertThat(used.tokenHash()).isEqualTo(HASH);
        assertThat(used.userId()).isEqualTo(USER_ID);
    }

    @Test
    void markUsed_whenAlreadyUsed_throwsIllegalStateException() {
        PasswordResetToken token = PasswordResetToken.reconstitute(
                HASH, USER_ID, Instant.now().plusSeconds(300L), true);

        assertThatIllegalStateException().isThrownBy(token::markUsed);
    }

    @Test
    void reconstitute_preservesAllFields() {
        Instant expiry = Instant.parse("2025-01-01T12:00:00Z");

        PasswordResetToken token = PasswordResetToken.reconstitute(HASH, USER_ID, expiry, false);

        assertThat(token.tokenHash()).isEqualTo(HASH);
        assertThat(token.userId()).isEqualTo(USER_ID);
        assertThat(token.expiresAt()).isEqualTo(expiry);
        assertThat(token.isUsed()).isFalse();
    }
}
