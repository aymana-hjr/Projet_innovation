package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.admin.GlobalStatsResponse;
import com.studyplanner.backend.dto.admin.UpdateUserRequest;
import com.studyplanner.backend.dto.admin.UserAdminResponse;
import com.studyplanner.backend.entity.*;
import com.studyplanner.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final StudySessionRepository studySessionRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final RoleRepository roleRepository;
    private final NotificationRepository notificationRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final SubjectRepository subjectRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupInvitationRepository groupInvitationRepository;
    private final SharedSessionRepository sharedSessionRepository;
    private final WeeklyGoalRepository weeklyGoalRepository;

    public GlobalStatsResponse getGlobalStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabledTrue();
        long disabledUsers = totalUsers - activeUsers;
        long totalTasks = taskRepository.count();
        long totalSessions = studySessionRepository.count();
        long completedSessions = studySessionRepository.countByCompletedTrue();
        long totalMinutes = studySessionRepository.sumCompletedMinutes();
        double totalStudyHours = Math.round((totalMinutes / 60.0) * 10) / 10.0;
        long completionRate = totalSessions > 0 ? (completedSessions * 100 / totalSessions) : 0;
        long totalGroups = studyGroupRepository.count();
        long newUsersLast7Days = userRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(7));

        return GlobalStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .disabledUsers(disabledUsers)
                .totalTasks(totalTasks)
                .totalSessions(totalSessions)
                .completedSessions(completedSessions)
                .totalStudyHours(totalStudyHours)
                .completionRate(completionRate)
                .totalGroups(totalGroups)
                .newUsersLast7Days(newUsersLast7Days)
                .build();
    }

    public List<UserAdminResponse> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toUserAdminResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserAdminResponse updateUser(Long id, UpdateUserRequest request, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }

        boolean wasAdmin = user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        boolean willBeAdmin = request.getRoles().contains("ROLE_ADMIN");

        if (wasAdmin && !willBeAdmin && user.getEmail().equals(currentAdminEmail)) {
            throw new RuntimeException("Vous ne pouvez pas retirer votre propre rôle administrateur");
        }

        if (wasAdmin && !willBeAdmin && countAdmins() <= 1) {
            throw new RuntimeException("Impossible de retirer le dernier administrateur");
        }

        Set<Role> roles = resolveRoles(request.getRoles());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setEnabled(request.isEnabled());
        user.setRoles(roles);

        return toUserAdminResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (user.getEmail().equals(currentAdminEmail)) {
            throw new RuntimeException("Vous ne pouvez pas supprimer votre propre compte");
        }

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName()));
        if (isAdmin && countAdmins() <= 1) {
            throw new RuntimeException("Impossible de supprimer le dernier administrateur");
        }

        deleteUserData(user);
        userRepository.delete(user);
    }

    private void deleteUserData(User user) {
        notificationRepository.deleteAll(notificationRepository.findByUserOrderByCreatedAtDesc(user));
        taskRepository.deleteAll(taskRepository.findByUserOrderByDueDateAsc(user));
        availabilitySlotRepository.deleteAll(availabilitySlotRepository.findByUser(user));

        List<StudySession> sessions = studySessionRepository.findByUser(user);
        for (StudySession session : sessions) {
            sharedSessionRepository.deleteAll(sharedSessionRepository.findByStudySession(session));
        }
        studySessionRepository.deleteAll(sessions);

        List<Subject> subjects = subjectRepository.findByUser(user);
        weeklyGoalRepository.deleteAll(weeklyGoalRepository.findBySubjectIn(subjects));
        subjectRepository.deleteAll(subjects);

        groupMemberRepository.deleteAll(groupMemberRepository.findByUser(user));
        groupInvitationRepository.deleteAll(groupInvitationRepository.findBySender(user));
        groupInvitationRepository.deleteAll(groupInvitationRepository.findByReceiver(user));

        List<StudyGroup> ownedGroups = studyGroupRepository.findByOwner(user);
        for (StudyGroup group : ownedGroups) {
            sharedSessionRepository.deleteAll(sharedSessionRepository.findByGroup(group));
            groupMemberRepository.deleteAll(groupMemberRepository.findByGroup(group));
            groupInvitationRepository.deleteAll(groupInvitationRepository.findByGroup(group));
            studyGroupRepository.delete(group);
        }
    }

    private Set<Role> resolveRoles(List<String> roleNames) {
        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Rôle inconnu : " + roleName));
            roles.add(role);
        }
        return roles;
    }

    private long countAdmins() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName())))
                .count();
    }

    private UserAdminResponse toUserAdminResponse(User user) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .sorted()
                .collect(Collectors.toList());

        return UserAdminResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .enabled(user.isEnabled())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
