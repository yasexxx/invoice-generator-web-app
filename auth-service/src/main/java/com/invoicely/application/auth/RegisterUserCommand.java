package com.invoicely.application.auth;

public record RegisterUserCommand(String email, String rawPassword) {}
