package com.firstclub.membership.model;

import jakarta.persistence.*;

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

    protected User() {}

    public User(String name, String email, String cohort) {
        this.name = name;
        this.email = email;
        this.cohort = cohort;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getCohort() { return cohort; }

    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setCohort(String cohort) { this.cohort = cohort; }
}
