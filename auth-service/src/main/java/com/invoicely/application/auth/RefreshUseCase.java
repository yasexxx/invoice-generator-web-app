package com.invoicely.application.auth;

public interface RefreshUseCase {

    AuthTokens execute(RefreshCommand command);
}
