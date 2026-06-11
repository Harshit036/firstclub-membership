package com.firstclub.membership.dto.response;

import com.firstclub.membership.model.TierType;
import java.math.BigDecimal;

public record RecommendedTierResponse(
        TierType recommendedTier,
        int tierLevel,
        String reason,
        int orderCount,
        BigDecimal monthlyOrderValue,
        String cohort
) {}
