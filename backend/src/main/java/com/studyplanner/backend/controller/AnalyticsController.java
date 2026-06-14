package com.studyplanner.backend.controller;

import com.studyplanner.backend.entity.StudySession;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.repository.StudySessionRepository;
import com.studyplanner.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final StudySessionRepository studySessionRepository;
    private final UserRepository userRepository;

   @GetMapping("/summary")
public Map<String, Object> getSummary(Principal principal) {
    User user = userRepository.findByEmail(principal.getName()).orElseThrow();
    // FILTRER PAR UTILISATEUR !
    List<StudySession> userSessions = studySessionRepository.findByUser(user);
    
    long totalMinutes = userSessions.stream()
            .filter(StudySession::isCompleted)
            .mapToLong(s -> s.getActualDurationMinutes() != null ? s.getActualDurationMinutes() : 0)
            .sum();

    long plannedSessions = userSessions.size();
    long completedSessions = userSessions.stream().filter(StudySession::isCompleted).count();

    Map<String, Object> stats = new HashMap<>();
    stats.put("totalHours", Math.round((totalMinutes / 60.0) * 10) / 10.0);
    stats.put("completionRate", plannedSessions > 0 ? (completedSessions * 100 / plannedSessions) : 0);
    stats.put("totalSessions", plannedSessions);
    stats.put("completedSessions", completedSessions);
    return stats;
}

@GetMapping("/subject-progress")
public List<Map<String, Object>> getSubjectProgress(Principal principal) {
    User user = userRepository.findByEmail(principal.getName()).orElseThrow();
    List<StudySession> userSessions = studySessionRepository.findByUser(user);

    // Grouper par matière et sommer les minutes réelles
    Map<String, Integer> progressMap = userSessions.stream()
            .filter(StudySession::isCompleted)
            .collect(Collectors.groupingBy(
                    s -> s.getSubject().getName(),
                    Collectors.summingInt(s -> s.getActualDurationMinutes() != null ? s.getActualDurationMinutes() : 0)
            ));

    return progressMap.entrySet().stream()
            .map(entry -> {
                Map<String, Object> item = new HashMap<>();
                item.put("subject", entry.getKey());
                item.put("minutes", entry.getValue());
                return item;
            })
            .collect(Collectors.toList());
}
@GetMapping("/weekly-productivity")
public List<Map<String, Object>> getWeeklyProductivity(Principal principal) {
    User user = userRepository.findByEmail(principal.getName()).orElseThrow();
    // On prend les sessions des 7 derniers jours
    LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
    List<StudySession> userSessions = studySessionRepository.findByUser(user);

    return userSessions.stream()
            .filter(s -> s.isCompleted() && s.getStartDateTime().isAfter(sevenDaysAgo))
            .collect(Collectors.groupingBy(
                    s -> s.getStartDateTime().toLocalDate().toString(),
                    Collectors.summingInt(s -> s.getActualDurationMinutes() != null ? s.getActualDurationMinutes() : 0)
            ))
            .entrySet().stream()
            .map(entry -> {
                Map<String, Object> dayData = new HashMap<>();
                dayData.put("date", entry.getKey());
                dayData.put("minutes", entry.getValue());
                return dayData;
            })
            .sorted(Comparator.comparing(m -> (String) m.get("date")))
            .collect(Collectors.toList());
}


}
