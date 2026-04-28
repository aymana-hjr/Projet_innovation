package com.studyplanner.backend.controller;

import com.studyplanner.backend.dto.WeeklyGoalRequest;
import com.studyplanner.backend.entity.WeeklyGoal;
import com.studyplanner.backend.service.WeeklyGoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weekly-goals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WeeklyGoalController {

    private final WeeklyGoalService weeklyGoalService;

    @GetMapping
    public ResponseEntity<List<WeeklyGoal>> getAll(Authentication auth) {
        return ResponseEntity.ok(weeklyGoalService.getGoals(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Void> save(Authentication auth, @Valid @RequestBody WeeklyGoalRequest request) {
        weeklyGoalService.saveGoal(auth.getName(), request);
        return ResponseEntity.ok().build();
    }
}
