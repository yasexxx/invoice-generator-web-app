package com.invoicely.infrastructure.mail;

import com.invoicely.application.port.EmailPort;
import com.invoicely.domain.user.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JavaMailEmailAdapter implements EmailPort {

    private static final String VERIFICATION_PATH   = "/verify-email?token=";
    private static final String RESET_PASSWORD_PATH = "/reset-password?token=";

    private final JavaMailSender mailSender;
    private final String         fromAddress;
    private final String         frontendUrl;

    public JavaMailEmailAdapter(
            JavaMailSender mailSender,
            @Value("${app.mail.from:noreply@invoicely.com}") String fromAddress,
            @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.mailSender  = mailSender;
        this.fromAddress = fromAddress;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void sendVerification(Email email, String rawToken) {
        log.debug("[MAIL] Sending verification email to={}", email.value());
        String link = frontendUrl + VERIFICATION_PATH + rawToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(email.value());
        message.setSubject(AuthEmailTemplates.verificationSubject());
        message.setText(AuthEmailTemplates.verificationBody(link));

        mailSender.send(message);
        log.info("[MAIL] Verification email sent to={}", email.value());
    }

    @Override
    public void sendPasswordReset(Email email, String rawToken) {
        log.debug("[MAIL] Sending password-reset email to={}", email.value());
        String link = frontendUrl + RESET_PASSWORD_PATH + rawToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(email.value());
        message.setSubject(AuthEmailTemplates.resetPasswordSubject());
        message.setText(AuthEmailTemplates.resetPasswordBody(link));

        mailSender.send(message);
        log.info("[MAIL] Password-reset email sent to={}", email.value());
    }
}
