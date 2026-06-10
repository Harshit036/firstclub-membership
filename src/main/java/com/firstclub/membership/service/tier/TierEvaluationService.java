package com.firstclub.membership.service.tier;

import com.firstclub.membership.model.TierType;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

/**
 * Aggregates all registered TierEvaluationStrategy beans and returns
 * the highest qualifying tier across all strategies.
 * Adding a new strategy is a new @Component — no changes here.
 */
@Service
public class TierEvaluationService {

    private final List<TierEvaluationStrategy> strategies;

    public TierEvaluationService(List<TierEvaluationStrategy> strategies) {
        this.strategies = strategies.stream()
                .sorted(Comparator.comparingInt(TierEvaluationStrategy::getPriority))
                .toList();
    }

    public TierType evaluate(TierEvaluationContext context) {
        return strategies.stream()
                .map(strategy -> strategy.evaluate(context))
                .filter(tier -> tier != null)
                .max(Comparator.comparingInt(TierType::getLevel))
                .orElse(TierType.SILVER);
    }
}
