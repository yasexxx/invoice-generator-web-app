package com.invoicely.application.port;

import com.invoicely.domain.user.Email;

public interface EmailPort {

    void sendVerification(Email email, String rawToken);

    void sendPasswordReset(Email email, String rawToken);
}
