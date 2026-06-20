package com.invoicely.application.auth;

public interface RefreshUseCase {

    /**
     * Validates the supplied refresh token and issues a new access + refresh token pair (token rotation).
     * Throws {@link InvalidTokenException} if the refresh token is missing, expired, or already revoked.
     *
     * @param command command carrying the raw refresh token from the HTTP-only cookie
     * @return new access token and rotated refresh token
     */
    AuthTokens execute(RefreshCommand command);
}
