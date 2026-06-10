package com.firstclub.membership.service.tier;

import java.math.BigDecimal;

public record TierEvaluationContext(
        Long userId,
        int orderCount,
        BigDecimal totalOrderValueThisMonth,
        String cohort
) {}
