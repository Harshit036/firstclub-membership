package com.firstclub.membership.controller;

import com.firstclub.membership.dto.request.SubscribeRequest;
import com.firstclub.membership.dto.request.TierChangeRequest;
import com.firstclub.membership.dto.response.SubscriptionResponse;
import com.firstclub.membership.service.UserSubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class UserSubscriptionController {

    private final UserSubscriptionService subscriptionService;

    public UserSubscriptionController(UserSubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponse> subscribe(@Valid @RequestBody SubscribeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.subscribe(request));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<SubscriptionResponse> getActiveSubscription(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getActiveSubscription(userId));
    }

    @GetMapping("/users/{userId}/history")
    public ResponseEntity<List<SubscriptionResponse>> getSubscriptionHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions(userId));
    }

    @PutMapping("/{id}/tier")
    public ResponseEntity<SubscriptionResponse> changeTier(
            @PathVariable Long id,
            @Valid @RequestBody TierChangeRequest request) {
        return ResponseEntity.ok(subscriptionService.changeTier(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SubscriptionResponse> cancelSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.cancelSubscription(id));
    }
}
