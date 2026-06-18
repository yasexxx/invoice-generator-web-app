package com.invoicely.infrastructure.mail;

final class AuthEmailTemplates {

    private static final String APP_NAME = "Invoicely";

    private AuthEmailTemplates() {}

    static String verificationSubject() {
        return "Verify your " + APP_NAME + " email address";
    }

    static String verificationBody(String verificationLink) {
        return "Welcome to " + APP_NAME + "!\n\n"
             + "Click the link below to verify your email address:\n"
             + verificationLink + "\n\n"
             + "This link expires in 24 hours.\n\n"
             + "If you did not sign up for " + APP_NAME + ", please ignore this email.";
    }

    static String resetPasswordSubject() {
        return "Reset your " + APP_NAME + " password";
    }

    static String resetPasswordBody(String resetLink) {
        return "You requested a password reset for your " + APP_NAME + " account.\n\n"
             + "Click the link below to set a new password:\n"
             + resetLink + "\n\n"
             + "This link expires in 10 minutes.\n\n"
             + "If you did not request a password reset, please ignore this email.";
    }
}
