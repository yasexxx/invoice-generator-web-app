CREATE TABLE refresh_tokens (
    token_hash TEXT          NOT NULL,
    user_id    UUID          NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ   NOT NULL,
    revoked    BOOLEAN       NOT NULL DEFAULT false,
    CONSTRAINT pk_refresh_tokens PRIMARY KEY (token_hash)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
