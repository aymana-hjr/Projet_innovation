package com.studyplanner.backend.dto.admin;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GlobalStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long disabledUsers;
    private long totalTasks;
    private long totalSessions;
    private long completedSessions;
    private double totalStudyHours;
    private long completionRate;
    private long totalGroups;
    private long newUsersLast7Days;
}
