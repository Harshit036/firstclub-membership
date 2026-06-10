package com.firstclub.membership.service;

import com.firstclub.membership.dto.response.TierResponse;
import com.firstclub.membership.exception.ResourceNotFoundException;
import com.firstclub.membership.model.MembershipTier;
import com.firstclub.membership.repository.MembershipTierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MembershipTierService {

    private final MembershipTierRepository tierRepository;

    public MembershipTierService(MembershipTierRepository tierRepository) {
        this.tierRepository = tierRepository;
    }

    public List<TierResponse> getAllTiers() {
        return tierRepository.findAllByOrderByTierLevelAsc().stream()
                .map(TierResponse::from)
                .toList();
    }

    public TierResponse getTierById(Long id) {
        return tierRepository.findById(id)
                .map(TierResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Membership tier not found with id: " + id));
    }

    public MembershipTier getTierEntityById(Long id) {
        return tierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership tier not found with id: " + id));
    }
}
