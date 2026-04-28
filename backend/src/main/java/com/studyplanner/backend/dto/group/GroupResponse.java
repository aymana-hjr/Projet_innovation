package com.studyplanner.backend.dto.group;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class GroupResponse {
    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private String ownerEmail;
    private LocalDateTime createdAt;
}