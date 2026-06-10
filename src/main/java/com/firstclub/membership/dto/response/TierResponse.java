package com.firstclub.membership.dto.response;

import com.firstclub.membership.model.MembershipTier;
import com.firstclub.membership.model.TierType;

import java.math.BigDecimal;
import java.util.List;

public record TierResponse(
        Long id,
        TierType tierType,
        int tierLevel,
        String description,
        BigDecimal priceMultiplier,
        List<BenefitResponse> benefits
) {
    public static TierResponse from(MembershipTier tier) {
        return new TierResponse(
                tier.getId(),
                tier.getTierType(),
                tier.getTierLevel(),
                tier.getDescription(),
                tier.getPriceMultiplier(),
                tier.getBenefits().stream().map(BenefitResponse::from).toList()
        );
    }
}
