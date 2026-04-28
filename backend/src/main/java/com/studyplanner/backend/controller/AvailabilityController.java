package com.studyplanner.backend.controller;

import com.studyplanner.backend.dto.AvailabilityRequest;
import com.studyplanner.backend.entity.AvailabilitySlot;
import com.studyplanner.backend.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availabilities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping
    public ResponseEntity<List<AvailabilitySlot>> getAll(Authentication auth) {
        return ResponseEntity.ok(availabilityService.getAvailabilities(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Void> save(Authentication auth, @Valid @RequestBody AvailabilityRequest request) {
        availabilityService.saveAvailability(auth.getName(), request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        availabilityService.deleteAvailability(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
