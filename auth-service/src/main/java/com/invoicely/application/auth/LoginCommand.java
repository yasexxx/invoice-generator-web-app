package com.invoicely.application.auth;

public record LoginCommand(String email, String rawPassword) {}
