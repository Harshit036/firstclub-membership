package com.firstclub.membership.dto.response;

import com.firstclub.membership.model.Benefit;
import com.firstclub.membership.model.BenefitType;

import java.math.BigDecimal;

public record BenefitResponse(
        Long id,
        BenefitType benefitType,
        BigDecimal discountPercentage,
        boolean enabled,
        String description
) {
    public static BenefitResponse from(Benefit benefit) {
        return new BenefitResponse(
                benefit.getId(),
                benefit.getBenefitType(),
                benefit.getDiscountPercentage(),
                benefit.isEnabled(),
                benefit.getDescription()
        );
    }
}
