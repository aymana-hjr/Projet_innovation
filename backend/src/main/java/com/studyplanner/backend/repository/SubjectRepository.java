package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.Subject;
import com.studyplanner.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByUser(User user);
    Optional<Subject> findByIdAndUser(Long id, User user);
}