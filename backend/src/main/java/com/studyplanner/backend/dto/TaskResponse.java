package com.studyplanner.backend.dto;

import com.studyplanner.backend.entity.TaskPriority;
import com.studyplanner.backend.entity.TaskStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
}
