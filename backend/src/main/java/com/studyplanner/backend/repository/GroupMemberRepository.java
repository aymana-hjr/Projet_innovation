package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.GroupMember;
import com.studyplanner.backend.entity.StudyGroup;
import com.studyplanner.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember,Long> {
    List<GroupMember> findByUser(User user);
    List<GroupMember> findByGroup(StudyGroup group);
    Optional<GroupMember> findByGroupAndUser(StudyGroup group, User user);
    boolean existsByGroupAndUser(StudyGroup group, User user);
}
