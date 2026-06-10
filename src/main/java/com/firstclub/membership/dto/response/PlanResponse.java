package com.firstclub.membership.dto.response;

import com.firstclub.membership.model.MembershipPlan;
import com.firstclub.membership.model.PlanType;

import java.math.BigDecimal;

public record PlanResponse(
        Long id,
        PlanType planType,
        BigDecimal price,
        int durationDays,
        String description
) {
    public static PlanResponse from(MembershipPlan plan) {
        return new PlanResponse(
                plan.getId(),
                plan.getPlanType(),
                plan.getPrice(),
                plan.getDurationDays(),
                plan.getDescription()
        );
    }
}
