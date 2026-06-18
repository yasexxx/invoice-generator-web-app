package com.invoicely.infrastructure.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = RegisterRequest.MIN_PASSWORD_LENGTH,
                        max = RegisterRequest.MAX_PASSWORD_LENGTH) String password
) {
    static final int MIN_PASSWORD_LENGTH = 8;
    static final int MAX_PASSWORD_LENGTH = 72;
}
