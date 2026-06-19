package com.invoicely.infrastructure.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
class DraftLineItemEmbeddable {

    @Column(name = "item_id", nullable = false)
    private UUID id;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @Column(name = "qty", nullable = false)
    private int qty;

    @Column(name = "rate", precision = 10, scale = 2, nullable = false)
    private BigDecimal rate;
}
