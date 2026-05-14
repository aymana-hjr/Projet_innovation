package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.group.*;
import com.studyplanner.backend.entity.*;
import com.studyplanner.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GroupService {

    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupInvitationRepository groupInvitationRepository;
    private final SharedSessionRepository sharedSessionRepository;
    private final StudySessionRepository studySessionRepository; // de la partie 2.2

    public GroupResponse createGroup(String email, CreateGroupRequest request) {
        User owner = getUserByEmail(email);

        StudyGroup group = StudyGroup.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .createdAt(LocalDateTime.now())
                .build();

        group = studyGroupRepository.save(group);

        GroupMember ownerMembership = GroupMember.builder()
                .group(group)
                .user(owner)
                .role(GroupRole.OWNER)
                .joinedAt(LocalDateTime.now())
                .build();
        groupMemberRepository.save(ownerMembership);

        return toGroupResponse(group);
    }

    @Transactional(readOnly = true)
    public List<GroupResponse> getMyGroups(String email) {
        User user = getUserByEmail(email);

        return groupMemberRepository.findByUser(user).stream()
                .map(GroupMember::getGroup)
                .distinct()
                .map(this::toGroupResponse)
                .toList();
    }

    public InvitationResponse inviteUser(String email, Long groupId, String receiverCode) {
        User sender = getUserByEmail(email);
        StudyGroup group = getGroupById(groupId);
        User receiver = userRepository.findByCollaborationCode(receiverCode)
                .orElseThrow(() -> new RuntimeException("Receiver not found with this code"));

        ensureGroupMember(group, sender);

        if (groupMemberRepository.existsByGroupAndUser(group, receiver)) {
            throw new RuntimeException("User is already a member of this group");
        }

        groupInvitationRepository.findByGroupAndReceiverAndStatus(group, receiver, InvitationStatus.PENDING)
                .ifPresent(inv -> { throw new RuntimeException("Pending invitation already exists"); });

        GroupInvitation invitation = GroupInvitation.builder()
                .group(group)
                .sender(sender)
                .receiver(receiver)
                .status(InvitationStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        invitation = groupInvitationRepository.save(invitation);
        return toInvitationResponse(invitation);
    }

    public InvitationResponse acceptInvitation(String email, Long invitationId) {
        User currentUser = getUserByEmail(email);

        GroupInvitation invitation = groupInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!invitation.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not allowed to accept this invitation");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("Invitation is not pending");
        }

        invitation.setStatus(InvitationStatus.ACCEPTED);
        groupInvitationRepository.save(invitation);

        if (!groupMemberRepository.existsByGroupAndUser(invitation.getGroup(), currentUser)) {
            GroupMember member = GroupMember.builder()
                    .group(invitation.getGroup())
                    .user(currentUser)
                    .role(GroupRole.MEMBER)
                    .joinedAt(LocalDateTime.now())
                    .build();
            groupMemberRepository.save(member);
        }

        return toInvitationResponse(invitation);
    }

    public InvitationResponse declineInvitation(String email, Long invitationId) {
        User currentUser = getUserByEmail(email);

        GroupInvitation invitation = groupInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!invitation.getReceiver().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not allowed to decline this invitation");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("Invitation is not pending");
        }

        invitation.setStatus(InvitationStatus.DECLINED);
        invitation = groupInvitationRepository.save(invitation);

        return toInvitationResponse(invitation);
    }

    public SharedSessionResponse shareSession(String email, Long groupId, Long studySessionId) {
        User currentUser = getUserByEmail(email);
        StudyGroup group = getGroupById(groupId);

        ensureGroupMember(group, currentUser);

        StudySession studySession = studySessionRepository.findById(studySessionId)
                .orElseThrow(() -> new RuntimeException("Study session not found"));

        if (!studySession.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only share your own sessions");
        }

        if (sharedSessionRepository.existsByGroupAndStudySession(group, studySession)) {
            throw new RuntimeException("This session is already shared in this group");
        }

        SharedSession sharedSession = SharedSession.builder()
                .group(group)
                .studySession(studySession)
                .sharedByUser(currentUser)
                .sharedAt(LocalDateTime.now())
                .build();

        sharedSession = sharedSessionRepository.save(sharedSession);
        return toSharedSessionResponse(sharedSession);
    }

    @Transactional(readOnly = true)
    public List<SharedSessionResponse> getGroupSharedSessions(String email, Long groupId) {
        User currentUser = getUserByEmail(email);
        StudyGroup group = getGroupById(groupId);

        ensureGroupMember(group, currentUser);

        return sharedSessionRepository.findByGroup(group).stream()
                .map(this::toSharedSessionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvitationResponse> myPendingInvitations(String email) {
        User currentUser = getUserByEmail(email);
        return groupInvitationRepository.findByReceiverAndStatus(currentUser, InvitationStatus.PENDING)
                .stream()
                .map(this::toInvitationResponse)
                .toList();
    }

    // Helpers
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private StudyGroup getGroupById(Long groupId) {
        return studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    private void ensureGroupMember(StudyGroup group, User user) {
        if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException("Access denied: you are not a member of this group");
        }
    }

    private GroupResponse toGroupResponse(StudyGroup g) {
        return GroupResponse.builder()
                .id(g.getId())
                .name(g.getName())
                .description(g.getDescription())
                .ownerId(g.getOwner().getId())
                .ownerEmail(g.getOwner().getEmail())
                .createdAt(g.getCreatedAt())
                .build();
    }

    private InvitationResponse toInvitationResponse(GroupInvitation i) {
        return InvitationResponse.builder()
                .id(i.getId())
                .groupId(i.getGroup().getId())
                .groupName(i.getGroup().getName())
                .senderId(i.getSender().getId())
                .senderEmail(i.getSender().getEmail())
                .receiverId(i.getReceiver().getId())
                .receiverEmail(i.getReceiver().getEmail())
                .status(i.getStatus())
                .createdAt(i.getCreatedAt())
                .build();
    }

    private SharedSessionResponse toSharedSessionResponse(SharedSession s) {
        return SharedSessionResponse.builder()
                .id(s.getId())
                .groupId(s.getGroup().getId())
                .studySessionId(s.getStudySession().getId())
                .sharedByUserId(s.getSharedByUser().getId())
                .sharedByEmail(s.getSharedByUser().getEmail())
                .sharedAt(s.getSharedAt())
                .build();
    }
}