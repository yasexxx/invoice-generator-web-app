package com.invoicely.infrastructure.events;

import com.invoicely.application.port.AuthEventPort;
import com.invoicely.domain.user.events.EmailVerifiedEvent;
import com.invoicely.domain.user.events.PasswordResetRequestedEvent;
import com.invoicely.domain.user.events.UserRegisteredEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class SpringAuthEventAdapter implements AuthEventPort {

    private final ApplicationEventPublisher publisher;

    public SpringAuthEventAdapter(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    @Override
    public void publish(UserRegisteredEvent event) {
        publisher.publishEvent(event);
    }

    @Override
    public void publish(EmailVerifiedEvent event) {
        publisher.publishEvent(event);
    }

    @Override
    public void publish(PasswordResetRequestedEvent event) {
        publisher.publishEvent(event);
    }
}
