package com.studyplanner.backend.dto.group;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InviteRequest {
    @NotNull(message = "receiverUserId is required")
    private Long receiverUserId;
}
