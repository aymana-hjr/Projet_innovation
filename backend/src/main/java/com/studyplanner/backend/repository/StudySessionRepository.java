package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.StudySession;
import com.studyplanner.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByUserAndStartDateTimeBetween(User user, LocalDateTime start, LocalDateTime end);

    boolean existsByUserAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
            User user, LocalDateTime end, LocalDateTime start
    );
}