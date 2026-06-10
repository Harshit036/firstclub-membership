package com.firstclub.membership.dto.request;

import java.math.BigDecimal;

public record UpdateTierRequest(BigDecimal priceMultiplier) {}
