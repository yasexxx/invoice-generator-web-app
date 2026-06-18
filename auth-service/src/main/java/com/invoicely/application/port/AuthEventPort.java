package com.invoicely.application.port;

import com.invoicely.domain.user.events.EmailVerifiedEvent;
import com.invoicely.domain.user.events.PasswordResetRequestedEvent;
import com.invoicely.domain.user.events.UserRegisteredEvent;

public interface AuthEventPort {

    void publish(UserRegisteredEvent event);

    void publish(EmailVerifiedEvent event);

    void publish(PasswordResetRequestedEvent event);
}
