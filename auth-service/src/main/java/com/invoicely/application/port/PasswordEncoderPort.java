package com.invoicely.application.port;

import com.invoicely.domain.user.HashedPassword;

public interface PasswordEncoderPort {

    HashedPassword encode(String rawPassword);

    boolean matches(String rawPassword, HashedPassword hashedPassword);
}
