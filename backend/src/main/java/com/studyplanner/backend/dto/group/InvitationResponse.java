package com.studyplanner.backend.dto.group;

import com.studyplanner.backend.entity.InvitationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class InvitationResponse {
    private Long id;
    private Long groupId;
    private String groupName;
    private Long senderId;
    private String senderEmail;
    private Long receiverId;
    private String receiverEmail;
    private InvitationStatus status;
    private LocalDateTime createdAt;
}
