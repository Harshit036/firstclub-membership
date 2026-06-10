package com.firstclub.membership.dto.request;

import java.math.BigDecimal;

public record UpdatePlanRequest(BigDecimal price, String description) {}
