package com.firstclub.membership.service;

import com.firstclub.membership.dto.response.PlanResponse;
import com.firstclub.membership.exception.ResourceNotFoundException;
import com.firstclub.membership.model.MembershipPlan;
import com.firstclub.membership.repository.MembershipPlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MembershipPlanService {

    private final MembershipPlanRepository planRepository;

    public MembershipPlanService(MembershipPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public List<PlanResponse> getAllPlans() {
        return planRepository.findAll().stream()
                .map(PlanResponse::from)
                .toList();
    }

    public PlanResponse getPlanById(Long id) {
        return planRepository.findById(id)
                .map(PlanResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with id: " + id));
    }

    public MembershipPlan getPlanEntityById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with id: " + id));
    }
}
