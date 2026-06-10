package com.firstclub.membership.controller;

import com.firstclub.membership.dto.response.TierResponse;
import com.firstclub.membership.service.MembershipTierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tiers")
public class MembershipTierController {

    private final MembershipTierService tierService;

    public MembershipTierController(MembershipTierService tierService) {
        this.tierService = tierService;
    }

    @GetMapping
    public ResponseEntity<List<TierResponse>> getAllTiers() {
        return ResponseEntity.ok(tierService.getAllTiers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TierResponse> getTierById(@PathVariable Long id) {
        return ResponseEntity.ok(tierService.getTierById(id));
    }
}
