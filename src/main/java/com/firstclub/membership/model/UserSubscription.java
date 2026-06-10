package com.firstclub.membership.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_subscriptions",
        indexes = @Index(name = "idx_user_status", columnList = "user_id, status"))
public class UserSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = false)
    private MembershipPlan plan;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tier_id", nullable = false)
    private MembershipTier tier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Optimistic locking — prevents concurrent tier changes from silently overwriting each other
    @Version
    private Long version;

    protected UserSubscription() {}

    public UserSubscription(Long userId, MembershipPlan plan, MembershipTier tier,
                             SubscriptionStatus status, LocalDate startDate, LocalDate endDate) {
        this.userId = userId;
        this.plan = plan;
        this.tier = tier;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public MembershipPlan getPlan() { return plan; }
    public MembershipTier getTier() { return tier; }
    public SubscriptionStatus getStatus() { return status; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Long getVersion() { return version; }

    public void setTier(MembershipTier tier) { this.tier = tier; }
    public void setStatus(SubscriptionStatus status) { this.status = status; }
}
