package com.invoicely.domain.user;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalArgumentException;
import static org.assertj.core.api.Assertions.assertThatNullPointerException;

class EmailTest {

    @Test
    void constructor_withValidEmail_storesNormalisedValue() {
        Email email = new Email("user@example.com");

        assertThat(email.value()).isEqualTo("user@example.com");
    }

    @Test
    void constructor_withUpperCaseEmail_normalisesToLowerCase() {
        Email email = new Email("User@Example.COM");

        assertThat(email.value()).isEqualTo("user@example.com");
    }

    @Test
    void constructor_withLeadingAndTrailingWhitespace_strips() {
        Email email = new Email("  user@example.com  ");

        assertThat(email.value()).isEqualTo("user@example.com");
    }

    @Test
    void constructor_withMixedCaseAndWhitespace_normalisesAndStrips() {
        Email email = new Email("  USER@EXAMPLE.COM  ");

        assertThat(email.value()).isEqualTo("user@example.com");
    }

    @Test
    void constructor_withNull_throwsNullPointerException() {
        assertThatNullPointerException()
                .isThrownBy(() -> new Email(null))
                .withMessageContaining("value");
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "not-an-email",
            "missing-at-sign.com",
            "@nodomain.com",
            "user@",
            "user@.com",
            "",
            "   "
    })
    void constructor_withInvalidFormat_throwsIllegalArgumentException(String invalid) {
        assertThatIllegalArgumentException()
                .isThrownBy(() -> new Email(invalid));
    }

    @Test
    void twoEmailsWithSameNormalisedValue_areEqual() {
        Email lower = new Email("user@example.com");
        Email upper = new Email("USER@EXAMPLE.COM");

        assertThat(lower).isEqualTo(upper);
    }

    @Test
    void constructor_withSubdomainEmail_isAccepted() {
        Email email = new Email("user@mail.example.co.uk");

        assertThat(email.value()).isEqualTo("user@mail.example.co.uk");
    }
}
