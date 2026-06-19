package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.invoice.Invoice;
import com.invoicely.domain.invoice.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
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
        return InvoiceMapper.toDomain(jpaRepository.save(InvoiceMapper.toEntity(invoice)));
    }

    @Override
    public Optional<Invoice> findById(UUID id) {
        log.debug("[REPO] Finding invoice id={}", id);
        return jpaRepository.findById(id).map(InvoiceMapper::toDomain);
    }

    @Override
    public void deleteById(UUID id) {
        log.debug("[REPO] Deleting invoice id={}", id);
        jpaRepository.deleteById(id);
    }

    @Override
    public List<String> findInvoiceNumbersByUserEmail(String userEmail) {
        log.debug("[REPO] Finding invoice numbers userEmail={}", userEmail);
        return jpaRepository.findInvoiceNumbersByUserEmail(userEmail);
    }

    @Override
    public boolean existsByUserEmailAndInvoiceNumber(String userEmail, String invoiceNumber) {
        return jpaRepository.existsByUserEmailAndInvoiceNumber(userEmail, invoiceNumber);
    }
}
