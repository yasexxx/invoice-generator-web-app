package com.invoicely.application.auth;

public interface ForgotPasswordUseCase {

    /**
     * Sends a password-reset email if the given address is registered.
     * Silently does nothing when the email is not found (prevents user enumeration).
     *
     * @param command command carrying the email address of the password-reset requester
     */
    void execute(ForgotPasswordCommand command);
}
