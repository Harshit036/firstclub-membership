package com.firstclub.membership.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tier_benefits")
public class Benefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tier_id", nullable = false)
    private MembershipTier tier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BenefitType benefitType;

    @Column(precision = 5, scale = 2)
    private BigDecimal discountPercentage;

    @Column(nullable = false)
    private boolean enabled;

    @Column
    private String description;

    protected Benefit() {}

    public Benefit(MembershipTier tier, BenefitType benefitType,
                   BigDecimal discountPercentage, boolean enabled, String description) {
        this.tier = tier;
        this.benefitType = benefitType;
        this.discountPercentage = discountPercentage;
        this.enabled = enabled;
        this.description = description;
    }

    public Long getId() { return id; }
    public MembershipTier getTier() { return tier; }
    public BenefitType getBenefitType() { return benefitType; }
    public BigDecimal getDiscountPercentage() { return discountPercentage; }
    public boolean isEnabled() { return enabled; }
    public String getDescription() { return description; }

    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public void setDiscountPercentage(BigDecimal discountPercentage) { this.discountPercentage = discountPercentage; }
}
