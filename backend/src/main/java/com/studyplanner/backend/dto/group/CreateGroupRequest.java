package com.studyplanner.backend.dto.group;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateGroupRequest {
    @NotBlank(message = "Group name is required")
    @Size(max=120)
    private String name;

    @Size(max=500)
    private String description;
}
