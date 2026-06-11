package com.firstclub.membership.controller;

import com.firstclub.membership.dto.request.UpdateBenefitRequest;
import com.firstclub.membership.dto.request.UpdatePlanRequest;
import com.firstclub.membership.dto.request.UpdateTierRequest;
import com.firstclub.membership.dto.request.UpdateUserStatsRequest;
import com.firstclub.membership.dto.response.BenefitResponse;
import com.firstclub.membership.dto.response.PlanResponse;
import com.firstclub.membership.dto.response.TierResponse;
import com.firstclub.membership.dto.response.UserResponse;
import com.firstclub.membership.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<PlanResponse> updatePlan(
            @PathVariable Long id,
            @RequestBody UpdatePlanRequest request) {
        return ResponseEntity.ok(adminService.updatePlan(id, request));
    }

    @PutMapping("/benefits/{id}")
    public ResponseEntity<BenefitResponse> updateBenefit(
            @PathVariable Long id,
            @RequestBody UpdateBenefitRequest request) {
        return ResponseEntity.ok(adminService.updateBenefit(id, request));
    }

    @PutMapping("/tiers/{id}")
    public ResponseEntity<TierResponse> updateTier(
            @PathVariable Long id,
            @RequestBody UpdateTierRequest request) {
        return ResponseEntity.ok(adminService.updateTier(id, request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUserStats(
            @PathVariable Long id,
            @RequestBody UpdateUserStatsRequest request) {
        return ResponseEntity.ok(adminService.updateUserStats(id, request));
    }
}
