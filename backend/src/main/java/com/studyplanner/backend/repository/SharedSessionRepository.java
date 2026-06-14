package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.SharedSession;
import com.studyplanner.backend.entity.StudyGroup;
import com.studyplanner.backend.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SharedSessionRepository extends JpaRepository<SharedSession, Long> {
    List<SharedSession> findByGroup(StudyGroup group);
    List<SharedSession> findByStudySession(StudySession studySession);
    boolean existsByGroupAndStudySession(StudyGroup group, StudySession studySession);
}
