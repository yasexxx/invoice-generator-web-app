package com.invoicely.domain.user.events;

import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.UserId;

public record EmailVerifiedEvent(UserId userId, Email email) {}
