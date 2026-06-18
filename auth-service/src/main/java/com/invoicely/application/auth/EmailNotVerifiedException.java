package com.invoicely.application.auth;

public class EmailNotVerifiedException extends RuntimeException {

    public EmailNotVerifiedException() {
        super("Email address has not been verified");
    }
}
