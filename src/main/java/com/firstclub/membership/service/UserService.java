package com.firstclub.membership.service;

import com.firstclub.membership.dto.request.CreateUserRequest;
import com.firstclub.membership.dto.response.RecommendedTierResponse;
import com.firstclub.membership.dto.response.UserResponse;
import com.firstclub.membership.exception.DuplicateSubscriptionException;
import com.firstclub.membership.exception.ResourceNotFoundException;
import com.firstclub.membership.model.TierType;
import com.firstclub.membership.model.User;
import com.firstclub.membership.repository.UserRepository;
import com.firstclub.membership.service.tier.TierEvaluationContext;
import com.firstclub.membership.service.tier.TierEvaluationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TierEvaluationService tierEvaluationService;

    public UserService(UserRepository userRepository, TierEvaluationService tierEvaluationService) {
        this.userRepository = userRepository;
        this.tierEvaluationService = tierEvaluationService;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateSubscriptionException("User already exists with email: " + request.email());
        }
        User user = new User(request.name(), request.email(), request.cohort(), 0, BigDecimal.ZERO);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public RecommendedTierResponse getRecommendedTier(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        TierEvaluationContext context = new TierEvaluationContext(
                userId, user.getOrderCount(), user.getMonthlyOrderValue(), user.getCohort());

        TierType recommended = tierEvaluationService.evaluate(context);
        String reason = buildReason(user, recommended);

        return new RecommendedTierResponse(recommended, recommended.getLevel(), reason,
                user.getOrderCount(), user.getMonthlyOrderValue(), user.getCohort());
    }

    public void validateUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
    }

    private String buildReason(User user, TierType recommendedTier) {
        List<String> reasons = new ArrayList<>();

        String cohort = user.getCohort() != null ? user.getCohort().toUpperCase() : null;
        if (cohort != null) {
            if (Set.of("ENTERPRISE", "VIP").contains(cohort)) {
                reasons.add(user.getCohort() + " cohort");
            } else if (Set.of("PREMIUM_PARTNER", "EARLY_ADOPTER").contains(cohort)) {
                reasons.add(user.getCohort() + " cohort");
            }
        }

        int count = user.getOrderCount();
        if (count >= 25) reasons.add(count + " orders (≥25)");
        else if (count >= 10) reasons.add(count + " orders (≥10)");

        BigDecimal val = user.getMonthlyOrderValue();
        if (val != null) {
            if (val.compareTo(new BigDecimal("15000")) >= 0)
                reasons.add("₹" + val.toPlainString() + " monthly spend (≥₹15,000)");
            else if (val.compareTo(new BigDecimal("5000")) >= 0)
                reasons.add("₹" + val.toPlainString() + " monthly spend (≥₹5,000)");
        }

        return reasons.isEmpty() ? "Default — below all promotion thresholds" : String.join(" · ", reasons);
    }
}
