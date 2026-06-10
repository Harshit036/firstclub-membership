package com.firstclub.membership.service.tier;

import com.firstclub.membership.model.TierType;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Grants a tier based on which cohort the user belongs to.
 * Useful for B2B partnerships, employee programs, or beta groups.
 */
@Component
public class CohortStrategy implements TierEvaluationStrategy {

    private static final Set<String> PLATINUM_COHORTS = Set.of("ENTERPRISE", "VIP");
    private static final Set<String> GOLD_COHORTS = Set.of("PREMIUM_PARTNER", "EARLY_ADOPTER");

    @Override
    public TierType evaluate(TierEvaluationContext context) {
        String cohort = context.cohort();
        if (cohort == null) return null;
        if (PLATINUM_COHORTS.contains(cohort.toUpperCase())) return TierType.PLATINUM;
        if (GOLD_COHORTS.contains(cohort.toUpperCase())) return TierType.GOLD;
        return null;
    }

    @Override
    public int getPriority() {
        return 3;
    }
}
