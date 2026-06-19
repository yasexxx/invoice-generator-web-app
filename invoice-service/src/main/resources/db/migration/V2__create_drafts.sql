CREATE TABLE drafts (
    id             UUID                     NOT NULL,
    template_id    VARCHAR(20)              NOT NULL DEFAULT '',
    paper_size     VARCHAR(20)              NOT NULL DEFAULT '',
    invoice_number VARCHAR(100)             NOT NULL DEFAULT '',
    issued_date    VARCHAR(50)              NOT NULL DEFAULT '',
    due_date       VARCHAR(50)              NOT NULL DEFAULT '',
    issuer_name    VARCHAR(255)             NOT NULL DEFAULT '',
    issuer_address TEXT                     NOT NULL DEFAULT '',
    client_name    VARCHAR(255)             NOT NULL DEFAULT '',
    client_email   VARCHAR(255)             NOT NULL DEFAULT '',
    client_address TEXT                     NOT NULL DEFAULT '',
    tax_percent    NUMERIC(5,2)             NOT NULL DEFAULT 0,
    discount       NUMERIC(10,2)            NOT NULL DEFAULT 0,
    notes          TEXT                     NOT NULL DEFAULT '',
    signature      TEXT                     NOT NULL DEFAULT '',
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT pk_drafts PRIMARY KEY (id)
);

CREATE TABLE draft_line_items (
    draft_id    UUID          NOT NULL,
    item_order  INTEGER       NOT NULL,
    item_id     UUID          NOT NULL,
    description VARCHAR(500)  NOT NULL DEFAULT '',
    qty         INTEGER       NOT NULL DEFAULT 1,
    rate        NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT pk_draft_line_items PRIMARY KEY (draft_id, item_order),
    CONSTRAINT fk_draft_line_items_draft FOREIGN KEY (draft_id)
        REFERENCES drafts(id) ON DELETE CASCADE
);
