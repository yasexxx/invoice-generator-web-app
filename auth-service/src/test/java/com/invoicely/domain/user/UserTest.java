package com.invoicely.domain.user;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;
import static org.assertj.core.api.Assertions.assertThatNullPointerException;

class UserTest {

    private static final UserId         VALID_ID  = UserId.generate();
    private static final Email          VALID_EMAIL = new Email("test@example.com");
    private static final HashedPassword VALID_HASH  = new HashedPassword("$2a$10$somehashvalue");

    @Test
    void constructor_withValidInputs_statusIsPendingVerification() {
        User user = new User(VALID_ID, VALID_EMAIL, VALID_HASH);

        assertThat(user.status()).isEqualTo(UserStatus.PENDING_VERIFICATION);
    }

    @Test
    void constructor_withValidInputs_assignsAllFields() {
        User user = new User(VALID_ID, VALID_EMAIL, VALID_HASH);

        assertThat(user.id()).isEqualTo(VALID_ID);
        assertThat(user.email()).isEqualTo(VALID_EMAIL);
        assertThat(user.hashedPassword()).isEqualTo(VALID_HASH);
        assertThat(user.createdAt()).isNotNull();
        assertThat(user.updatedAt()).isNotNull();
    }

    @Test
    void constructor_withNullId_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new User(null, VALID_EMAIL, VALID_HASH))
                .withMessageContaining("id");
    }

    @Test
    void constructor_withNullEmail_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new User(VALID_ID, null, VALID_HASH))
                .withMessageContaining("email");
    }

    @Test
    void constructor_withNullHashedPassword_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new User(VALID_ID, VALID_EMAIL, null))
                .withMessageContaining("hashedPassword");
    }

    @Test
    void verify_whenPendingVerification_returnsNewUserWithActiveStatus() {
        User pending = new User(VALID_ID, VALID_EMAIL, VALID_HASH);

        User active = pending.verify();

        assertThat(active.status()).isEqualTo(UserStatus.ACTIVE);
    }

    @Test
    void verify_whenPendingVerification_preservesIdentityAndCredentials() {
        User pending = new User(VALID_ID, VALID_EMAIL, VALID_HASH);

        User active = pending.verify();

        assertThat(active.id()).isEqualTo(pending.id());
        assertThat(active.email()).isEqualTo(pending.email());
        assertThat(active.hashedPassword()).isEqualTo(pending.hashedPassword());
        assertThat(active.createdAt()).isEqualTo(pending.createdAt());
    }

    @Test
    void verify_doesNotMutateOriginalUser() {
        User pending = new User(VALID_ID, VALID_EMAIL, VALID_HASH);

        pending.verify();

        assertThat(pending.status()).isEqualTo(UserStatus.PENDING_VERIFICATION);
    }

    @Test
    void verify_whenAlreadyActive_throwsIllegalStateException() {
        User active = User.reconstitute(VALID_ID, VALID_EMAIL, VALID_HASH,
                UserStatus.ACTIVE, Instant.now(), Instant.now());

        assertThatIllegalStateException().isThrownBy(active::verify);
    }

    @Test
    void verify_whenSuspended_throwsIllegalStateException() {
        User suspended = User.reconstitute(VALID_ID, VALID_EMAIL, VALID_HASH,
                UserStatus.SUSPENDED, Instant.now(), Instant.now());

        assertThatIllegalStateException().isThrownBy(suspended::verify);
    }

    @Test
    void reconstitute_preservesAllFields() {
        Instant created = Instant.parse("2024-01-01T00:00:00Z");
        Instant updated = Instant.parse("2024-06-01T12:00:00Z");

        User user = User.reconstitute(
                VALID_ID, VALID_EMAIL, VALID_HASH,
                UserStatus.ACTIVE, created, updated);

        assertThat(user.id()).isEqualTo(VALID_ID);
        assertThat(user.email()).isEqualTo(VALID_EMAIL);
        assertThat(user.hashedPassword()).isEqualTo(VALID_HASH);
        assertThat(user.status()).isEqualTo(UserStatus.ACTIVE);
        assertThat(user.createdAt()).isEqualTo(created);
        assertThat(user.updatedAt()).isEqualTo(updated);
    }
}
