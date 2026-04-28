package com.studyplanner.backend.repository;

import com.studyplanner.backend.entity.AvailabilitySlot;
import com.studyplanner.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByUser(User user);
}