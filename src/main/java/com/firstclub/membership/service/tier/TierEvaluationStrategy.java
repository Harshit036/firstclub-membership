package com.firstclub.membership.service.tier;

import com.firstclub.membership.model.TierType;

/**
 * Strategy interface for evaluating which tier a user qualifies for.
 * Implement this to add new tier-promotion criteria without modifying existing code.
 */
public interface TierEvaluationStrategy {

    /**
     * Returns the tier this strategy can promote a user to, or null if the user does not qualify.
     */
    TierType evaluate(TierEvaluationContext context);

    /**
     * Lower priority value = evaluated first. Strategies are applied in priority order;
     * the highest qualifying tier wins.
     */
    int getPriority();
}
