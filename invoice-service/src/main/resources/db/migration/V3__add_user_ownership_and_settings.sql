ALTER TABLE invoices
    ADD COLUMN user_email      VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN invoice_number  VARCHAR(100) NOT NULL DEFAULT '';

ALTER TABLE drafts
    ADD COLUMN user_email VARCHAR(255) NOT NULL DEFAULT '';

CREATE TABLE user_invoice_settings (
    id          UUID                     NOT NULL,
    user_email  VARCHAR(255)             NOT NULL,
    prefix      VARCHAR(50)              NOT NULL,
    is_selected BOOLEAN                  NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT pk_user_invoice_settings PRIMARY KEY (id),
    CONSTRAINT uq_user_invoice_settings_prefix UNIQUE (user_email, prefix)
);

CREATE INDEX idx_invoices_user_email ON invoices (user_email);
CREATE INDEX idx_drafts_user_email   ON drafts   (user_email);
CREATE INDEX idx_user_invoice_settings_user_email ON user_invoice_settings (user_email);
