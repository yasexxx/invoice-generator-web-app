package com.invoicely.application.invoice;

import com.invoicely.domain.invoice.TemplateId;

import java.math.BigDecimal;
import java.util.List;

public record CreateInvoiceCommand(
    String     userEmail,
    String     invoiceNumber,
    TemplateId templateId,
    String     clientName,
    String     clientEmail,
    String     clientAddress,
    List<LineItemCommand> lineItems,
    BigDecimal taxPercent,
    BigDecimal discount,
    String     notes
) {}
