CREATE TABLE invoices (
    id             UUID                     NOT NULL,
    template_id    VARCHAR(20)              NOT NULL,
    client_name    VARCHAR(255)             NOT NULL,
    client_email   VARCHAR(255)             NOT NULL,
    client_address VARCHAR(500),
    tax_percent    NUMERIC(5,2)             NOT NULL DEFAULT 0,
    discount       NUMERIC(10,2)            NOT NULL DEFAULT 0,
    notes          TEXT,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT pk_invoices PRIMARY KEY (id)
);

CREATE TABLE invoice_line_items (
    invoice_id  UUID          NOT NULL,
    item_order  INTEGER       NOT NULL,
    item_id     UUID          NOT NULL,
    description VARCHAR(500)  NOT NULL,
    qty         INTEGER       NOT NULL,
    rate        NUMERIC(10,2) NOT NULL,
    CONSTRAINT pk_invoice_line_items PRIMARY KEY (invoice_id, item_order),
    CONSTRAINT fk_line_items_invoice FOREIGN KEY (invoice_id)
        REFERENCES invoices(id) ON DELETE CASCADE
);
