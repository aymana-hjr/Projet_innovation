package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.Subject;
import com.studyplanner.backend.entity.WeeklyGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WeeklyGoalRepository extends JpaRepository<WeeklyGoal, Long> {
    List<WeeklyGoal> findBySubjectIn(List<Subject> subjects);
    Optional<WeeklyGoal> findBySubject(Subject subject);
}
