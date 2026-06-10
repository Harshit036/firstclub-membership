package com.firstclub.membership.dto.response;

import com.firstclub.membership.model.User;

public record UserResponse(Long id, String name, String email, String cohort) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCohort());
    }
}
