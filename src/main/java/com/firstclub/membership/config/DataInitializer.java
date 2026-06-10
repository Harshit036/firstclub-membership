package com.firstclub.membership.config;

import com.firstclub.membership.model.*;
import com.firstclub.membership.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final MembershipPlanRepository planRepository;
    private final MembershipTierRepository tierRepository;
    private final UserRepository userRepository;

    public DataInitializer(MembershipPlanRepository planRepository,
                           MembershipTierRepository tierRepository,
                           UserRepository userRepository) {
        this.planRepository = planRepository;
        this.tierRepository = tierRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedPlans();
        seedTiers();
        seedUsers();
        log.info("Data initialization complete.");
    }

    private void seedPlans() {
        if (planRepository.count() > 0) return;

        planRepository.saveAll(List.of(
                new MembershipPlan(PlanType.MONTHLY, new BigDecimal("99.00"),
                        PlanType.MONTHLY.getDurationDays(), "Monthly membership — billed every 30 days"),
                new MembershipPlan(PlanType.QUARTERLY, new BigDecimal("249.00"),
                        PlanType.QUARTERLY.getDurationDays(), "Quarterly membership — billed every 90 days, save 16%"),
                new MembershipPlan(PlanType.YEARLY, new BigDecimal("799.00"),
                        PlanType.YEARLY.getDurationDays(), "Yearly membership — billed annually, save 33%")
        ));
        log.info("Seeded {} membership plans.", planRepository.count());
    }

    private void seedTiers() {
        if (tierRepository.count() > 0) return;

        MembershipTier silver = new MembershipTier(
                TierType.SILVER, TierType.SILVER.getLevel(), "Silver tier — free delivery + 5% discount",
                new BigDecimal("1.00"));
        silver.getBenefits().addAll(List.of(
                new Benefit(silver, BenefitType.FREE_DELIVERY, null, true, "Free delivery on all orders"),
                new Benefit(silver, BenefitType.DISCOUNT, new BigDecimal("5.00"), true, "5% discount on selected items")
        ));

        MembershipTier gold = new MembershipTier(
                TierType.GOLD, TierType.GOLD.getLevel(), "Gold tier — free delivery + 10% discount + exclusive deals",
                new BigDecimal("1.35"));
        gold.getBenefits().addAll(List.of(
                new Benefit(gold, BenefitType.FREE_DELIVERY, null, true, "Free delivery on all orders"),
                new Benefit(gold, BenefitType.DISCOUNT, new BigDecimal("10.00"), true, "10% discount on selected categories"),
                new Benefit(gold, BenefitType.EXCLUSIVE_DEALS, null, true, "Access to exclusive deals and early sale access")
        ));

        MembershipTier platinum = new MembershipTier(
                TierType.PLATINUM, TierType.PLATINUM.getLevel(), "Platinum tier — all benefits + 15% discount + priority support",
                new BigDecimal("1.70"));
        platinum.getBenefits().addAll(List.of(
                new Benefit(platinum, BenefitType.FREE_DELIVERY, null, true, "Free delivery on all orders"),
                new Benefit(platinum, BenefitType.DISCOUNT, new BigDecimal("15.00"), true, "15% discount across all categories"),
                new Benefit(platinum, BenefitType.EXCLUSIVE_DEALS, null, true, "Early access to sales and exclusive coupons"),
                new Benefit(platinum, BenefitType.PRIORITY_SUPPORT, null, true, "Priority customer support with dedicated queue")
        ));

        tierRepository.saveAll(List.of(silver, gold, platinum));
        log.info("Seeded {} membership tiers.", tierRepository.count());
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.saveAll(List.of(
                new User("Alice Kumar", "alice@example.com", "EARLY_ADOPTER"),
                new User("Bob Sharma", "bob@example.com", "ENTERPRISE"),
                new User("Carol Singh", "carol@example.com", "REGULAR")
        ));
        log.info("Seeded {} demo users.", userRepository.count());
    }
}
