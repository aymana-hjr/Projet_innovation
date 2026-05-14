package com.studyplanner.backend.controller;

import com.studyplanner.backend.dto.group.*;
import com.studyplanner.backend.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GroupResponse createGroup(@Valid @RequestBody CreateGroupRequest request, Principal principal) {
        return groupService.createGroup(principal.getName(), request);
    }

    @GetMapping("/my")
    public List<GroupResponse> myGroups(Principal principal) {
        return groupService.getMyGroups(principal.getName());
    }

    @PostMapping("/{groupId}/invite")
    public InvitationResponse invite(@PathVariable Long groupId,
                                     @Valid @RequestBody InviteRequest request,
                                     Principal principal) {
        return groupService.inviteUser(principal.getName(), groupId, request.getReceiverCode());
    }

    @GetMapping("/invitations/pending")
    public List<InvitationResponse> myPendingInvitations(Principal principal) {
        return groupService.myPendingInvitations(principal.getName());
    }

    @PostMapping("/invitations/{invitationId}/accept")
    public InvitationResponse accept(@PathVariable Long invitationId, Principal principal) {
        return groupService.acceptInvitation(principal.getName(), invitationId);
    }

    @PostMapping("/invitations/{invitationId}/decline")
    public InvitationResponse decline(@PathVariable Long invitationId, Principal principal) {
        return groupService.declineInvitation(principal.getName(), invitationId);
    }

    @PostMapping("/{groupId}/sessions/{studySessionId}/share")
    public SharedSessionResponse shareSession(@PathVariable Long groupId,
                                              @PathVariable Long studySessionId,
                                              Principal principal) {
        return groupService.shareSession(principal.getName(), groupId, studySessionId);
    }

    @GetMapping("/{groupId}/sessions")
    public List<SharedSessionResponse> groupSessions(@PathVariable Long groupId, Principal principal) {
        return groupService.getGroupSharedSessions(principal.getName(), groupId);
    }
}