package com.studyplanner.backend.controller;

import com.studyplanner.backend.dto.GeneratePlanResponse;
import com.studyplanner.backend.dto.StudySessionResponse;
import com.studyplanner.backend.service.PlanningService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/planning")
@RequiredArgsConstructor
public class PlanningController {

    private final PlanningService planningService;

    @PostMapping("/generate")
    public GeneratePlanResponse generate(@RequestParam LocalDate weekStart, Principal principal) {
        return planningService.generateWeeklyPlan(principal.getName(), weekStart);
    }

    @GetMapping("/sessions")
    public List<StudySessionResponse> sessions(@RequestParam LocalDate weekStart, Principal principal) {
        return planningService.getWeekSessions(principal.getName(), weekStart);
    }
}
