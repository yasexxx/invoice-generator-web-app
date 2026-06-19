CREATE TABLE user_invoice_preferences (
    user_email     VARCHAR(255)  NOT NULL,
    template_id    VARCHAR(50)   NOT NULL DEFAULT 'MINIMALIST',
    paper_size     VARCHAR(20)   NOT NULL DEFAULT 'a4',
    issuer_name    VARCHAR(255)  NOT NULL DEFAULT '',
    issuer_address TEXT          NOT NULL DEFAULT '',
    tax_percent    DECIMAL(5,2)  NOT NULL DEFAULT 10.00,
    discount       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    signature      TEXT          NOT NULL DEFAULT '',
    CONSTRAINT pk_user_invoice_preferences PRIMARY KEY (user_email)
);
