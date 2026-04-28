package com.studyplanner.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GeneratePlanResponse {
    private int sessionsCreated;
    private int totalMinutesPlanned;
    private String message;
}
