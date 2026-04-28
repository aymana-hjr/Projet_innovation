package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.AvailabilityRequest;
import com.studyplanner.backend.entity.AvailabilitySlot;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.repository.AvailabilitySlotRepository;
import com.studyplanner.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final UserRepository userRepository;

    public List<AvailabilitySlot> getAvailabilities(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return availabilitySlotRepository.findByUser(user);
    }

    @Transactional
    public void saveAvailability(String email, AvailabilityRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        AvailabilitySlot slot = AvailabilitySlot.builder()
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .user(user)
                .build();
        availabilitySlotRepository.save(slot);
    }

    @Transactional
    public void deleteAvailability(String email, Long id) {
        User user = userRepository.findByEmail(email).orElseThrow();
        AvailabilitySlot slot = availabilitySlotRepository.findById(id)
                .filter(s -> s.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Slot not found or unauthorized"));
        availabilitySlotRepository.delete(slot);
    }
}
