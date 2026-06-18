package com.invoicely.infrastructure.security;

import com.invoicely.application.auth.InvalidTokenException;
import com.invoicely.application.port.TokenIssuerPort;
import com.invoicely.domain.user.UserId;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final TokenIssuerPort tokenIssuerPort;

    public JwtAuthFilter(TokenIssuerPort tokenIssuerPort) {
        this.tokenIssuerPort = tokenIssuerPort;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }
        String token = authHeader.substring(BEARER_PREFIX.length());
        try {
            UserId userId = tokenIssuerPort.validateAccessToken(token);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    userId.value().toString(), null, List.of());
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (InvalidTokenException e) {
            log.debug("[JWT] Auth filter rejected token: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }
        chain.doFilter(request, response);
    }
}
