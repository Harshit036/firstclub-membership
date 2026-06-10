package com.firstclub.membership.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "membership_plans")
public class MembershipPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private PlanType planType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private int durationDays;

    @Column
    private String description;

    protected MembershipPlan() {}

    public MembershipPlan(PlanType planType, BigDecimal price, int durationDays, String description) {
        this.planType = planType;
        this.price = price;
        this.durationDays = durationDays;
        this.description = description;
    }

    public Long getId() { return id; }
    public PlanType getPlanType() { return planType; }
    public BigDecimal getPrice() { return price; }
    public int getDurationDays() { return durationDays; }
    public String getDescription() { return description; }

    public void setPrice(BigDecimal price) { this.price = price; }
    public void setDescription(String description) { this.description = description; }
}
