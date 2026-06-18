package com.invoicely.domain.user;

import java.time.Instant;
import java.util.Objects;

public class User {

    private final UserId         id;
    private final Email          email;
    private final HashedPassword hashedPassword;
    private final UserStatus     status;
    private final Instant        createdAt;
    private final Instant        updatedAt;

    public User(UserId id, Email email, HashedPassword hashedPassword) {
        this(id, email, hashedPassword,
             UserStatus.PENDING_VERIFICATION,
             Instant.now(), Instant.now());
    }

    private User(
            UserId id,
            Email email,
            HashedPassword hashedPassword,
            UserStatus status,
            Instant createdAt,
            Instant updatedAt) {
        Objects.requireNonNull(id,             "id");
        Objects.requireNonNull(email,          "email");
        Objects.requireNonNull(hashedPassword, "hashedPassword");
        Objects.requireNonNull(status,         "status");
        Objects.requireNonNull(createdAt,      "createdAt");
        Objects.requireNonNull(updatedAt,      "updatedAt");
        this.id             = id;
        this.email          = email;
        this.hashedPassword = hashedPassword;
        this.status         = status;
        this.createdAt      = createdAt;
        this.updatedAt      = updatedAt;
    }

    public static User reconstitute(
            UserId id,
            Email email,
            HashedPassword hashedPassword,
            UserStatus status,
            Instant createdAt,
            Instant updatedAt) {
        return new User(id, email, hashedPassword, status, createdAt, updatedAt);
    }

    public User verify() {
        if (status != UserStatus.PENDING_VERIFICATION) {
            throw new IllegalStateException(
                    "Cannot verify user in status: " + status);
        }
        return new User(id, email, hashedPassword,
                        UserStatus.ACTIVE, createdAt, Instant.now());
    }

    public User changePassword(HashedPassword newPassword) {
        Objects.requireNonNull(newPassword, "newPassword");
        return new User(id, email, newPassword, status, createdAt, Instant.now());
    }

    public UserId         id()             { return id; }
    public Email          email()          { return email; }
    public HashedPassword hashedPassword() { return hashedPassword; }
    public UserStatus     status()         { return status; }
    public Instant        createdAt()      { return createdAt; }
    public Instant        updatedAt()      { return updatedAt; }
}
