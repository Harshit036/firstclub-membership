package com.firstclub.membership.model;

public enum TierType {
    SILVER(1),
    GOLD(2),
    PLATINUM(3);

    private final int level;

    TierType(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }
}
