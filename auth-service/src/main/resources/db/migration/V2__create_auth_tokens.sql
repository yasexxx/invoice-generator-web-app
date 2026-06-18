CREATE TABLE verification_tokens (
    token_hash TEXT        PRIMARY KEY,
    user_id    UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN     NOT NULL DEFAULT false
);

CREATE INDEX idx_verification_tokens_user_id ON verification_tokens (user_id);

CREATE TABLE password_reset_tokens (
    token_hash TEXT        PRIMARY KEY,
    user_id    UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN     NOT NULL DEFAULT false
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens (user_id);
