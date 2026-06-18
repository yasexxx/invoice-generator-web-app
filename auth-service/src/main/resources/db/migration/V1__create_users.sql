CREATE TABLE users (
    id              UUID        PRIMARY KEY,
    email           TEXT        NOT NULL UNIQUE,
    hashed_password TEXT        NOT NULL,
    status          TEXT        NOT NULL DEFAULT 'PENDING_VERIFICATION',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
