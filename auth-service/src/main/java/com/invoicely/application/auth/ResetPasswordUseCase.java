package com.invoicely.application.auth;

public interface ResetPasswordUseCase {

    /**
     * Resets the user's password using a one-time reset token and revokes all existing refresh tokens.
     * Throws {@link InvalidTokenException} if the token is missing, expired, or already consumed.
     *
     * @param command command carrying the reset token and the new raw (unhashed) password
     */
    void execute(ResetPasswordCommand command);
}
