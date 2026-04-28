package com.studyplanner.backend.dto;

import com.studyplanner.backend.entity.SubjectPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SubjectRequest {
    @NotBlank(message = "Le nom est requis")
    private String name;

    @NotNull(message = "La priorité est requise")
    private SubjectPriority priority;
}
