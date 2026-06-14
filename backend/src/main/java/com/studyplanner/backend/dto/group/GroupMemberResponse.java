package com.studyplanner.backend.dto.group;

import com.studyplanner.backend.entity.GroupRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GroupMemberResponse {
    private Long id;
    private String username;
    private String email;
    private GroupRole role;
}
