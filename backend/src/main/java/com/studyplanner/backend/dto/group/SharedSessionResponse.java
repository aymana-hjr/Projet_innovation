package com.studyplanner.backend.dto.group;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SharedSessionResponse {
    private Long id;
    private Long groupId;
    private Long studySessionId;
    private Long sharedByUserId;
    private String sharedByEmail;
    private String sharedByUsername;
    private LocalDateTime sharedAt;
    private String subject;
    private String taskTitle;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}