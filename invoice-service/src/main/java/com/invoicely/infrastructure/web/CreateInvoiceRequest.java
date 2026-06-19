package com.invoicely.infrastructure.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record CreateInvoiceRequest(
        @NotBlank String templateId,
        String invoiceNumber,
        @NotBlank String clientName,
        @NotBlank @Email String clientEmail,
        String clientAddress,
        @NotNull @Valid List<LineItemRequest> lineItems,
        @NotNull @DecimalMin("0") BigDecimal taxPercent,
        @NotNull @DecimalMin("0") BigDecimal discount,
        String notes
) {
    public record LineItemRequest(
            @NotBlank String description,
            @Min(1) int qty,
            @NotNull @DecimalMin("0") BigDecimal rate
    ) {}
}
