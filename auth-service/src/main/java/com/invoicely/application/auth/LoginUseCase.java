package com.invoicely.application.auth;

public interface LoginUseCase {

    /**
     * Authenticates a user by email and password and issues access + refresh tokens.
     * Throws {@link InvalidCredentialsException} for bad credentials, or
     * {@link EmailNotVerifiedException} if the user has not yet verified their email.
     *
     * @param command command carrying email and raw password
     * @return issued access token and raw refresh token
     */
    AuthTokens execute(LoginCommand command);
}
