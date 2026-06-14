package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.GroupInvitation;
import com.studyplanner.backend.entity.InvitationStatus;
import com.studyplanner.backend.entity.StudyGroup;
import com.studyplanner.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupInvitationRepository extends JpaRepository<GroupInvitation, Long> {
    List<GroupInvitation> findByReceiverAndStatus(User receiver, InvitationStatus status);

    Optional<GroupInvitation> findByGroupAndReceiverAndStatus(
            StudyGroup group, User receiver, InvitationStatus status
    );

    List<GroupInvitation> findBySender(User sender);
    List<GroupInvitation> findByReceiver(User receiver);
    List<GroupInvitation> findByGroup(StudyGroup group);
}