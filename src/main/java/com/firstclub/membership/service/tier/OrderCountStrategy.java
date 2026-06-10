package com.firstclub.membership.service.tier;

import com.firstclub.membership.model.TierType;
import org.springframework.stereotype.Component;

/**
 * Promotes users based on total number of orders placed.
 * Thresholds: GOLD >= 10 orders, PLATINUM >= 25 orders.
 */
@Component
public class OrderCountStrategy implements TierEvaluationStrategy {

    private static final int GOLD_THRESHOLD = 10;
    private static final int PLATINUM_THRESHOLD = 25;

    @Override
    public TierType evaluate(TierEvaluationContext context) {
        int count = context.orderCount();
        if (count >= PLATINUM_THRESHOLD) return TierType.PLATINUM;
        if (count >= GOLD_THRESHOLD) return TierType.GOLD;
        return TierType.SILVER;
    }

    @Override
    public int getPriority() {
        return 1;
    }
}
