package com.firstclub.membership.dto.request;

import java.math.BigDecimal;

public record UpdateUserStatsRequest(Integer orderCount, BigDecimal monthlyOrderValue) {}
