package com.invoicely.application.auth;

public interface LoginUseCase {

    AuthTokens execute(LoginCommand command);
}
