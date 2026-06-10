package com.firstclub.membership.dto.request;

import jakarta.validation.constraints.NotNull;

public record SubscribeRequest(
        @NotNull(message = "User ID is required") Long userId,
        @NotNull(message = "Plan ID is required") Long planId,
        @NotNull(message = "Tier ID is required") Long tierId
) {}
