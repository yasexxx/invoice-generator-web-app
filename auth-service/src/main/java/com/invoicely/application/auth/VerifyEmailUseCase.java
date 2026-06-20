package com.invoicely.application.auth;

public interface VerifyEmailUseCase {

    /**
     * Marks a user's email as verified using the one-time verification token.
     * Throws {@link InvalidTokenException} if the token is missing, expired, or already consumed.
     *
     * @param command command carrying the raw verification token from the email link
     */
    void execute(VerifyEmailCommand command);
}
