package com.invoicely.application.port;

import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.UserId;

public interface TokenIssuerPort {

    String issueAccessToken(UserId userId, Email email);

    UserId validateAccessToken(String token);
}
