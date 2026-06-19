package com.invoicely.infrastructure.web;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record SaveInvoicePreferencesRequest(
        @NotBlank @Size(max = 50)  String     templateId,
        @NotBlank @Size(max = 20)  String     paperSize,
        @Size(max = 255)           String     issuerName,
                                   String     issuerAddress,
        @NotNull @DecimalMin("0")  BigDecimal taxPercent,
        @NotNull @DecimalMin("0")  BigDecimal discount,
                                   String     signature
) {}
