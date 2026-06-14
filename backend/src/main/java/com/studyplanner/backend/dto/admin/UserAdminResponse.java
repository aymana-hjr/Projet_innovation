package com.studyplanner.backend.dto.admin;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class UserAdminResponse {
    private Long id;
    private String fullName;
    private String email;
    private boolean enabled;
    private List<String> roles;
    private LocalDateTime createdAt;
}
