package com.invoicely.infrastructure.web;

import com.invoicely.application.auth.RegisterUserCommand;
import com.invoicely.application.auth.RegisterUserUseCase;
import com.invoicely.application.auth.VerifyEmailCommand;
import com.invoicely.application.auth.VerifyEmailUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final VerifyEmailUseCase  verifyEmailUseCase;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        log.debug("[WEB] POST /api/auth/register email={}", request.email());
        registerUserUseCase.execute(toCommand(request));
    }

    @GetMapping("/verify-email")
    public void verifyEmail(@RequestParam String token) {
        log.debug("[WEB] GET /api/auth/verify-email");
        verifyEmailUseCase.execute(new VerifyEmailCommand(token));
    }

    private RegisterUserCommand toCommand(RegisterRequest r) {
        return new RegisterUserCommand(r.email(), r.password());
    }
}
