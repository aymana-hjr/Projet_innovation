package com.studyplanner.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class StudySessionResponse {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private boolean isGenerated;
}
