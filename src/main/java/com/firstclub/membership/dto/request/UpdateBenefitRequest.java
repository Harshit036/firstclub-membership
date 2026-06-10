package com.firstclub.membership.dto.request;

import java.math.BigDecimal;

public record UpdateBenefitRequest(boolean enabled, BigDecimal discountPercentage) {}
