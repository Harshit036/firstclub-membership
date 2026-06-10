package com.firstclub.membership.service;

import com.firstclub.membership.dto.request.SubscribeRequest;
import com.firstclub.membership.dto.request.TierChangeRequest;
import com.firstclub.membership.dto.response.SubscriptionResponse;
import com.firstclub.membership.exception.DuplicateSubscriptionException;
import com.firstclub.membership.exception.InvalidTierTransitionException;
import com.firstclub.membership.exception.ResourceNotFoundException;
import com.firstclub.membership.model.*;
import com.firstclub.membership.repository.UserSubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class UserSubscriptionService {

    private final UserSubscriptionRepository subscriptionRepository;
    private final MembershipPlanService planService;
    private final MembershipTierService tierService;
    private final UserService userService;

    public UserSubscriptionService(UserSubscriptionRepository subscriptionRepository,
                                   MembershipPlanService planService,
                                   MembershipTierService tierService,
                                   UserService userService) {
        this.subscriptionRepository = subscriptionRepository;
        this.planService = planService;
        this.tierService = tierService;
        this.userService = userService;
    }

    /**
     * SERIALIZABLE isolation prevents two concurrent subscribe() calls for the same user
     * from both passing the duplicate-active-subscription check and both inserting.
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public SubscriptionResponse subscribe(SubscribeRequest request) {
        userService.validateUserExists(request.userId());

        // Pessimistic lock: block concurrent subscribes for the same user
        subscriptionRepository.findActiveSubscriptionForUpdate(request.userId())
                .ifPresent(existing -> {
                    throw new DuplicateSubscriptionException(
                            "User already has an active subscription (id: " + existing.getId() + "). " +
                            "Cancel it before subscribing again.");
                });

        MembershipPlan plan = planService.getPlanEntityById(request.planId());
        MembershipTier tier = tierService.getTierEntityById(request.tierId());

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(plan.getDurationDays());

        UserSubscription subscription = new UserSubscription(
                request.userId(), plan, tier, SubscriptionStatus.ACTIVE, startDate, endDate);

        return SubscriptionResponse.from(subscriptionRepository.save(subscription));
    }

    @Transactional(readOnly = true)
    public SubscriptionResponse getActiveSubscription(Long userId) {
        userService.validateUserExists(userId);
        UserSubscription subscription = subscriptionRepository
                .findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No active subscription found for user id: " + userId));
        return SubscriptionResponse.from(subscription);
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getAllSubscriptions(Long userId) {
        userService.validateUserExists(userId);
        return subscriptionRepository.findAllByUserId(userId).stream()
                .map(SubscriptionResponse::from)
                .toList();
    }

    /**
     * Optimistic locking (@Version on UserSubscription) ensures that if two requests
     * try to change the tier concurrently, only one succeeds; the other gets an
     * OptimisticLockException which the GlobalExceptionHandler returns as HTTP 409.
     */
    @Transactional
    public SubscriptionResponse changeTier(Long subscriptionId, TierChangeRequest request) {
        UserSubscription subscription = getActiveSubscriptionEntity(subscriptionId);
        MembershipTier newTier = tierService.getTierEntityById(request.tierId());

        if (subscription.getTier().getId().equals(newTier.getId())) {
            throw new InvalidTierTransitionException(
                    "Already subscribed to tier: " + newTier.getTierType());
        }

        subscription.setTier(newTier);
        return SubscriptionResponse.from(subscriptionRepository.save(subscription));
    }

    @Transactional
    public SubscriptionResponse cancelSubscription(Long subscriptionId) {
        UserSubscription subscription = getActiveSubscriptionEntity(subscriptionId);
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        return SubscriptionResponse.from(subscriptionRepository.save(subscription));
    }

    private UserSubscription getActiveSubscriptionEntity(Long subscriptionId) {
        UserSubscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subscription not found with id: " + subscriptionId));
        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Subscription is not active. Current status: " + subscription.getStatus());
        }
        return subscription;
    }
}
