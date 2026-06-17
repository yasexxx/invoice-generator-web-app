package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.invoice.Invoice;
import com.invoicely.domain.invoice.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
@Slf4j
public class InvoiceRepositoryAdapter implements InvoiceRepository {

    private final InvoiceJpaRepository jpaRepository;

    @Override
    public Invoice save(Invoice invoice) {
        log.debug("[REPO] Saving invoice id={}", invoice.id());
        InvoiceEntity entity = InvoiceMapper.toEntity(invoice);
        return InvoiceMapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Invoice> findById(UUID id) {
        log.debug("[REPO] Finding invoice id={}", id);
        return jpaRepository.findById(id).map(InvoiceMapper::toDomain);
    }
}
