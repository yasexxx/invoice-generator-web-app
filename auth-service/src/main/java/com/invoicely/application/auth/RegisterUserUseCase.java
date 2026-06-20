package com.invoicely.application.auth;

public interface RegisterUserUseCase {

    /**
     * Registers a new user and sends an email-verification link.
     * Throws {@link EmailAlreadyRegisteredException} if the email is already in use.
     *
     * @param command command carrying email and raw (unhashed) password
     */
    void execute(RegisterUserCommand command);
}
