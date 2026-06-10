package com.firstclub.membership.service.tier;

import com.firstclub.membership.model.TierType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Promotes users based on total order value within the current month.
 * Thresholds: GOLD >= ₹5,000, PLATINUM >= ₹15,000.
 */
@Component
public class OrderValueStrategy implements TierEvaluationStrategy {

    private static final BigDecimal GOLD_THRESHOLD = new BigDecimal("5000");
    private static final BigDecimal PLATINUM_THRESHOLD = new BigDecimal("15000");

    @Override
    public TierType evaluate(TierEvaluationContext context) {
        BigDecimal value = context.totalOrderValueThisMonth();
        if (value == null) return null;
        if (value.compareTo(PLATINUM_THRESHOLD) >= 0) return TierType.PLATINUM;
        if (value.compareTo(GOLD_THRESHOLD) >= 0) return TierType.GOLD;
        return null;
    }

    @Override
    public int getPriority() {
        return 2;
    }
}
