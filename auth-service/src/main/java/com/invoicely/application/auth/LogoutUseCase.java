package com.invoicely.application.auth;

public interface LogoutUseCase {

    /**
     * Revokes the supplied refresh token so it can no longer be used for token rotation.
     * Silently succeeds if the token is already revoked or does not exist.
     *
     * @param command command carrying the raw refresh token to revoke
     */
    void execute(LogoutCommand command);
}
