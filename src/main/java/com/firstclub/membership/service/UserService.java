package com.firstclub.membership.service;

import com.firstclub.membership.dto.request.CreateUserRequest;
import com.firstclub.membership.dto.response.UserResponse;
import com.firstclub.membership.exception.DuplicateSubscriptionException;
import com.firstclub.membership.exception.ResourceNotFoundException;
import com.firstclub.membership.model.User;
import com.firstclub.membership.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateSubscriptionException("User already exists with email: " + request.email());
        }
        User user = new User(request.name(), request.email(), request.cohort());
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
    }
}
