package com.firstclub.membership.dto.response;

import com.firstclub.membership.model.User;
import java.math.BigDecimal;

public record UserResponse(Long id, String name, String email, String cohort, int orderCount, BigDecimal monthlyOrderValue) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCohort(),
                user.getOrderCount(), user.getMonthlyOrderValue());
    }
}
