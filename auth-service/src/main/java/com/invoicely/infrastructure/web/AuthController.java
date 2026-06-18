package com.invoicely.infrastructure.web;

import com.invoicely.application.auth.AuthTokens;
import com.invoicely.application.auth.InvalidTokenException;
import com.invoicely.application.auth.LoginCommand;
import com.invoicely.application.auth.LoginUseCase;
import com.invoicely.application.auth.LogoutCommand;
import com.invoicely.application.auth.LogoutUseCase;
import com.invoicely.application.auth.RefreshCommand;
import com.invoicely.application.auth.RefreshUseCase;
import com.invoicely.application.auth.RegisterUserCommand;
import com.invoicely.application.auth.RegisterUserUseCase;
import com.invoicely.application.auth.VerifyEmailCommand;
import com.invoicely.application.auth.VerifyEmailUseCase;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;
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

    private static final String REFRESH_COOKIE_NAME    = "rt";
    private static final String REFRESH_COOKIE_PATH    = "/api/auth";
    private static final long   REFRESH_COOKIE_MAX_AGE = 2_592_000L;

    private final RegisterUserUseCase registerUserUseCase;
    private final VerifyEmailUseCase  verifyEmailUseCase;
    private final LoginUseCase        loginUseCase;
    private final RefreshUseCase      refreshUseCase;
    private final LogoutUseCase       logoutUseCase;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        log.debug("[WEB] POST /api/auth/register email={}", request.email());
        registerUserUseCase.execute(toRegisterCommand(request));
    }

    @GetMapping("/verify-email")
    public void verifyEmail(@RequestParam String token) {
        log.debug("[WEB] GET /api/auth/verify-email");
        verifyEmailUseCase.execute(new VerifyEmailCommand(token));
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginRestResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        log.debug("[WEB] POST /api/auth/login email={}", request.email());
        AuthTokens tokens = loginUseCase.execute(toLoginCommand(request));
        addRefreshCookie(response, tokens.rawRefreshToken());
        return toResponse(tokens);
    }

    @PostMapping("/refresh")
    @ResponseStatus(HttpStatus.OK)
    public LoginRestResponse refresh(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String rawRefreshToken,
            HttpServletResponse response) {
        log.debug("[WEB] POST /api/auth/refresh");
        if (rawRefreshToken == null) {
            throw new InvalidTokenException("Refresh token cookie missing");
        }
        AuthTokens tokens = refreshUseCase.execute(new RefreshCommand(rawRefreshToken));
        addRefreshCookie(response, tokens.rawRefreshToken());
        return toResponse(tokens);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String rawRefreshToken,
            HttpServletResponse response) {
        log.debug("[WEB] POST /api/auth/logout");
        if (rawRefreshToken != null) {
            logoutUseCase.execute(new LogoutCommand(rawRefreshToken));
        }
        clearRefreshCookie(response);
    }

    private RegisterUserCommand toRegisterCommand(RegisterRequest r) {
        return new RegisterUserCommand(r.email(), r.password());
    }

    private LoginCommand toLoginCommand(LoginRequest r) {
        return new LoginCommand(r.email(), r.password());
    }

    private LoginRestResponse toResponse(AuthTokens tokens) {
        return new LoginRestResponse(tokens.accessToken());
    }

    private void addRefreshCookie(HttpServletResponse response, String rawToken) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, rawToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path(REFRESH_COOKIE_PATH)
                .maxAge(REFRESH_COOKIE_MAX_AGE)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path(REFRESH_COOKIE_PATH)
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
