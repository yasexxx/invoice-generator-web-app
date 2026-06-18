package com.invoicely.infrastructure.persistence;

import com.invoicely.domain.user.Email;
import com.invoicely.domain.user.HashedPassword;
import com.invoicely.domain.user.User;
import com.invoicely.domain.user.UserId;
import com.invoicely.domain.user.UserStatus;

final class UserMapper {

    private UserMapper() {}

    static UserEntity toEntity(User user) {
        return new UserEntity(
                user.id().value(),
                user.email().value(),
                user.hashedPassword().value(),
                user.status().name(),
                user.createdAt(),
                user.updatedAt()
        );
    }

    static User toDomain(UserEntity entity) {
        return User.reconstitute(
                new UserId(entity.getId()),
                new Email(entity.getEmail()),
                new HashedPassword(entity.getHashedPassword()),
                UserStatus.valueOf(entity.getStatus()),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
