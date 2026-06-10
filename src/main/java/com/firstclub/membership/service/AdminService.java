package com.firstclub.membership.service;

import com.firstclub.membership.dto.request.UpdateBenefitRequest;
import com.firstclub.membership.dto.request.UpdatePlanRequest;
import com.firstclub.membership.dto.request.UpdateTierRequest;
import com.firstclub.membership.dto.response.BenefitResponse;
import com.firstclub.membership.dto.response.PlanResponse;
import com.firstclub.membership.dto.response.TierResponse;
import com.firstclub.membership.dto.response.UserResponse;
import com.firstclub.membership.exception.ResourceNotFoundException;
import com.firstclub.membership.model.Benefit;
import com.firstclub.membership.model.MembershipPlan;
import com.firstclub.membership.model.MembershipTier;
import com.firstclub.membership.repository.MembershipPlanRepository;
import com.firstclub.membership.repository.MembershipTierRepository;
import com.firstclub.membership.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final MembershipPlanRepository planRepository;
    private final MembershipTierRepository tierRepository;
    private final UserRepository userRepository;

    public AdminService(MembershipPlanRepository planRepository,
                        MembershipTierRepository tierRepository,
                        UserRepository userRepository) {
        this.planRepository = planRepository;
        this.tierRepository = tierRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PlanResponse updatePlan(Long id, UpdatePlanRequest request) {
        MembershipPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + id));
        if (request.price() != null) plan.setPrice(request.price());
        if (request.description() != null) plan.setDescription(request.description());
        return PlanResponse.from(planRepository.save(plan));
    }

    @Transactional
    public BenefitResponse updateBenefit(Long id, UpdateBenefitRequest request) {
        Benefit benefit = tierRepository.findAll().stream()
                .flatMap(t -> t.getBenefits().stream())
                .filter(b -> b.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Benefit not found with id: " + id));
        benefit.setEnabled(request.enabled());
        if (request.discountPercentage() != null) benefit.setDiscountPercentage(request.discountPercentage());
        // benefit is managed via cascade — saving the tier persists the benefit
        tierRepository.save(benefit.getTier());
        return BenefitResponse.from(benefit);
    }

    @Transactional
    public TierResponse updateTier(Long id, UpdateTierRequest request) {
        MembershipTier tier = tierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tier not found with id: " + id));
        if (request.priceMultiplier() != null) tier.setPriceMultiplier(request.priceMultiplier());
        return TierResponse.from(tierRepository.save(tier));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }
}
