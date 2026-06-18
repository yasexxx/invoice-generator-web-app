package com.invoicely.infrastructure.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank String token,
        @NotBlank @Size(min = ResetPasswordRequest.MIN_PASSWORD_LENGTH,
                        max = ResetPasswordRequest.MAX_PASSWORD_LENGTH) String newPassword
) {
    static final int MIN_PASSWORD_LENGTH = 8;
    static final int MAX_PASSWORD_LENGTH = 72;
}
