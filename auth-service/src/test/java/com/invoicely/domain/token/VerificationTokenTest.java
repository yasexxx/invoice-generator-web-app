package com.invoicely.domain.token;

import com.invoicely.domain.user.UserId;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;
import static org.assertj.core.api.Assertions.assertThatNullPointerException;

class VerificationTokenTest {

    private static final String HASH    = "sha256hashvalue";
    private static final UserId USER_ID = UserId.generate();

    @Test
    void constructor_setsExpiryToTwentyFourHoursFromNow() {
        Instant before = Instant.now();

        VerificationToken token = new VerificationToken(HASH, USER_ID);

        Instant expectedExpiry = before.plusSeconds(86_400L);
        assertThat(token.expiresAt())
                .isAfterOrEqualTo(expectedExpiry.minusSeconds(2L))
                .isBeforeOrEqualTo(expectedExpiry.plusSeconds(2L));
    }

    @Test
    void constructor_withNullTokenHash_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new VerificationToken(null, USER_ID))
                .withMessageContaining("tokenHash");
    }

    @Test
    void constructor_withBlankTokenHash_throwsIllegalArgumentException() {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> new VerificationToken("   ", USER_ID));
    }

    @Test
    void constructor_withNullUserId_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new VerificationToken(HASH, null))
                .withMessageContaining("userId");
    }

    @Test
    void isExpired_whenExpiryIsInPast_returnsTrue() {
        VerificationToken token = VerificationToken.reconstitute(
                HASH, USER_ID, Instant.now().minusSeconds(1L), false);

        assertThat(token.isExpired()).isTrue();
    }

    @Test
    void isExpired_whenExpiryIsInFuture_returnsFalse() {
        VerificationToken token = new VerificationToken(HASH, USER_ID);

        assertThat(token.isExpired()).isFalse();
    }

    @Test
    void isUsed_onNewToken_returnsFalse() {
        VerificationToken token = new VerificationToken(HASH, USER_ID);

        assertThat(token.isUsed()).isFalse();
    }

    @Test
    void markUsed_returnsNewTokenWithUsedTrue() {
        VerificationToken token = new VerificationToken(HASH, USER_ID);

        VerificationToken used = token.markUsed();

        assertThat(used.isUsed()).isTrue();
    }

    @Test
    void markUsed_doesNotMutateOriginalToken() {
        VerificationToken token = new VerificationToken(HASH, USER_ID);

        token.markUsed();

        assertThat(token.isUsed()).isFalse();
    }

    @Test
    void markUsed_preservesTokenHashAndUserId() {
        VerificationToken token = new VerificationToken(HASH, USER_ID);

        VerificationToken used = token.markUsed();

        assertThat(used.tokenHash()).isEqualTo(HASH);
        assertThat(used.userId()).isEqualTo(USER_ID);
    }

    @Test
    void markUsed_whenAlreadyUsed_throwsIllegalStateException() {
        VerificationToken token = VerificationToken.reconstitute(
                HASH, USER_ID, Instant.now().plusSeconds(3600L), true);

        assertThatIllegalStateException().isThrownBy(token::markUsed);
    }

    @Test
    void reconstitute_preservesAllFields() {
        Instant expiry = Instant.parse("2025-01-01T12:00:00Z");

        VerificationToken token = VerificationToken.reconstitute(HASH, USER_ID, expiry, true);

        assertThat(token.tokenHash()).isEqualTo(HASH);
        assertThat(token.userId()).isEqualTo(USER_ID);
        assertThat(token.expiresAt()).isEqualTo(expiry);
        assertThat(token.isUsed()).isTrue();
    }
}
