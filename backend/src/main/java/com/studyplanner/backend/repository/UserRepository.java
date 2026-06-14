package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByCollaborationCode(String code);
    long countByEnabledTrue();
    long countByCreatedAtAfter(LocalDateTime date);
    List<User> findAllByOrderByCreatedAtDesc();
}
