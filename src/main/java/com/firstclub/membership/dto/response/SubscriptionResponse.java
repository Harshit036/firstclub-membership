package com.firstclub.membership.dto.response;

import com.firstclub.membership.model.SubscriptionStatus;
import com.firstclub.membership.model.UserSubscription;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public record SubscriptionResponse(
        Long id,
        Long userId,
        PlanResponse plan,
        TierResponse tier,
        SubscriptionStatus status,
        LocalDate startDate,
        LocalDate endDate,
        long daysRemaining,
        BigDecimal effectivePrice,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SubscriptionResponse from(UserSubscription sub) {
        long daysRemaining = Math.max(0, ChronoUnit.DAYS.between(LocalDate.now(), sub.getEndDate()));
        BigDecimal effectivePrice = sub.getPlan().getPrice()
                .multiply(sub.getTier().getPriceMultiplier())
                .setScale(2, RoundingMode.HALF_UP);
        return new SubscriptionResponse(
                sub.getId(),
                sub.getUserId(),
                PlanResponse.from(sub.getPlan()),
                TierResponse.from(sub.getTier()),
                sub.getStatus(),
                sub.getStartDate(),
                sub.getEndDate(),
                daysRemaining,
                effectivePrice,
                sub.getCreatedAt(),
                sub.getUpdatedAt()
        );
    }
}
