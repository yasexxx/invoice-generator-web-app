package com.invoicely.infrastructure.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SavePrefixRequest(
        @NotBlank @Size(max = 50) String prefix
) {}
