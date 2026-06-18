package com.invoicely.application.auth;

public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(String reason) {
        super(reason);
    }
}
