package com.firstclub.membership.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column
    private String cohort;

    @Column(nullable = false)
    private int orderCount = 0;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyOrderValue = BigDecimal.ZERO;

    protected User() {}

    public User(String name, String email, String cohort, int orderCount, BigDecimal monthlyOrderValue) {
        this.name = name;
        this.email = email;
        this.cohort = cohort;
        this.orderCount = orderCount;
        this.monthlyOrderValue = monthlyOrderValue;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getCohort() { return cohort; }
    public int getOrderCount() { return orderCount; }
    public BigDecimal getMonthlyOrderValue() { return monthlyOrderValue; }

    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setCohort(String cohort) { this.cohort = cohort; }
    public void setOrderCount(int orderCount) { this.orderCount = orderCount; }
    public void setMonthlyOrderValue(BigDecimal monthlyOrderValue) { this.monthlyOrderValue = monthlyOrderValue; }
}
