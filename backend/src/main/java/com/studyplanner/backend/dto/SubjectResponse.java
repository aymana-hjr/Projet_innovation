package com.studyplanner.backend.dto;

import com.studyplanner.backend.entity.SubjectPriority;
import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class SubjectResponse {
    private Long id;
    private String name;
    private SubjectPriority priority;
}
