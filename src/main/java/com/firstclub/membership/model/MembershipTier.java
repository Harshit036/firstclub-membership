package com.firstclub.membership.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "membership_tiers")
public class MembershipTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private TierType tierType;

    @Column(nullable = false)
    private int tierLevel;

    @Column
    private String description;

    // Multiplier applied to base plan price. SILVER=1.0, GOLD=1.35, PLATINUM=1.7
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal priceMultiplier;

    @OneToMany(mappedBy = "tier", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<Benefit> benefits = new ArrayList<>();

    protected MembershipTier() {}

    public MembershipTier(TierType tierType, int tierLevel, String description, BigDecimal priceMultiplier) {
        this.tierType = tierType;
        this.tierLevel = tierLevel;
        this.description = description;
        this.priceMultiplier = priceMultiplier;
    }

    public Long getId() { return id; }
    public TierType getTierType() { return tierType; }
    public int getTierLevel() { return tierLevel; }
    public String getDescription() { return description; }
    public BigDecimal getPriceMultiplier() { return priceMultiplier; }
    public List<Benefit> getBenefits() { return benefits; }

    public void setPriceMultiplier(BigDecimal priceMultiplier) { this.priceMultiplier = priceMultiplier; }
}
