package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.HashedPassword;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserId;
import com.invoicely.domain.user.UserStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(UserRepositoryAdapter.class)
@Testcontainers
class UserRepositoryAdapterTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withNetworkMode("bridge");

    @DynamicPropertySource
    static void overrideDatasource(DynamicPropertyRegistry registry) {
        String ip = postgres.getContainerInfo()
                .getNetworkSettings()
                .getNetworks()
                .get("bridge")
                .getIpAddress();
        registry.add("spring.datasource.url",
                () -> "jdbc:postgresql://" + ip + ":5432/" + postgres.getDatabaseName());
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.url",
                () -> "jdbc:postgresql://" + ip + ":5432/" + postgres.getDatabaseName());
        registry.add("spring.flyway.user", postgres::getUsername);
        registry.add("spring.flyway.password", postgres::getPassword);
    }

    @Autowired
    UserRepositoryAdapter adapter;

    private User newUser(String email) {
        return new User(UserId.generate(), new Email(email), new HashedPassword("$2a$10$hash"));
    }

    @Test
    void save_persistsUserAndReturnsWithSameId() {
        User user = newUser("save@example.com");

        User saved = adapter.save(user);

        assertThat(saved.id()).isEqualTo(user.id());
        assertThat(saved.email()).isEqualTo(user.email());
        assertThat(saved.status()).isEqualTo(UserStatus.PENDING_VERIFICATION);
    }

    @Test
    void findByEmail_withExistingEmail_returnsUser() {
        adapter.save(newUser("find@example.com"));

        Optional<User> found = adapter.findByEmail(new Email("find@example.com"));

        assertThat(found).isPresent();
        assertThat(found.get().email().value()).isEqualTo("find@example.com");
    }

    @Test
    void findByEmail_withUnknownEmail_returnsEmpty() {
        Optional<User> found = adapter.findByEmail(new Email("ghost@example.com"));

        assertThat(found).isEmpty();
    }

    @Test
    void existsByEmail_withExistingEmail_returnsTrue() {
        adapter.save(newUser("exists@example.com"));

        assertThat(adapter.existsByEmail(new Email("exists@example.com"))).isTrue();
    }

    @Test
    void existsByEmail_withUnknownEmail_returnsFalse() {
        assertThat(adapter.existsByEmail(new Email("nobody@example.com"))).isFalse();
    }

    @Test
    void save_updatedUser_persistsNewStatus() {
        User pending = adapter.save(newUser("verify@example.com"));
        User verified = pending.verify();

        User saved = adapter.save(verified);

        assertThat(saved.status()).isEqualTo(UserStatus.ACTIVE);
    }

    @Test
    void findById_preservesCreatedAt() {
        User user = adapter.save(newUser("ts@example.com"));

        User found = adapter.findById(user.id()).orElseThrow();

        assertThat(found.createdAt()).isCloseTo(user.createdAt(), within(1, ChronoUnit.MICROS));
    }
}
