package com.invoicely.application.auth;

public record ResetPasswordCommand(String rawToken, String newPassword) {}
