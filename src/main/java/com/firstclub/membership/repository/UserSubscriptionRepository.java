package com.firstclub.membership.repository;

import com.firstclub.membership.model.SubscriptionStatus;
import com.firstclub.membership.model.UserSubscription;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    Optional<UserSubscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);

    List<UserSubscription> findAllByUserId(Long userId);

    boolean existsByUserIdAndStatus(Long userId, SubscriptionStatus status);

    // Pessimistic lock used during subscription creation to prevent duplicate active subscriptions
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM UserSubscription s WHERE s.userId = :userId AND s.status = 'ACTIVE'")
    Optional<UserSubscription> findActiveSubscriptionForUpdate(@Param("userId") Long userId);
}
