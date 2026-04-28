package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.StudyGroup;
import com.studyplanner.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroup,Long> {
    List<StudyGroup> findByOwner(User owner);
}
