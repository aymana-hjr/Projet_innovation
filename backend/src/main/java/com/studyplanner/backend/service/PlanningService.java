package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.GeneratePlanResponse;
import com.studyplanner.backend.dto.StudySessionResponse;
import com.studyplanner.backend.entity.*;
import com.studyplanner.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanningService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final WeeklyGoalRepository weeklyGoalRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final StudySessionRepository studySessionRepository;

    private static final int MAX_SESSION_MINUTES = 90;

    public GeneratePlanResponse generateWeeklyPlan(String email, LocalDate weekStart) {
        User user = userRepository.findByEmail(email).orElseThrow();

        LocalDateTime weekStartDateTime = weekStart.atStartOfDay();
        LocalDateTime weekEndDateTime = weekStart.plusDays(7).atStartOfDay();

        List<Subject> subjects = subjectRepository.findByUser(user);
        subjects.sort(Comparator.comparing(Subject::getPriority).reversed()); // HIGH first

        List<AvailabilitySlot> slots = availabilitySlotRepository.findByUser(user);

        int created = 0;
        int totalMinutes = 0;

        for (Subject subject : subjects) {
            int target = weeklyGoalRepository.findBySubject(subject)
                    .map(WeeklyGoal::getTargetMinutesPerWeek)
                    .orElse(0);

            int planned = 0;

            for (AvailabilitySlot slot : slots) {
                if (planned >= target) break;

                LocalDate slotDate = resolveDateInWeek(weekStart, slot.getDayOfWeek());
                LocalDateTime cursor = LocalDateTime.of(slotDate, slot.getStartTime());
                LocalDateTime slotEnd = LocalDateTime.of(slotDate, slot.getEndTime());

                while (cursor.isBefore(slotEnd) && planned < target) {
                    int remainingGoal = target - planned;
                    int remainingSlot = (int) Duration.between(cursor, slotEnd).toMinutes();
                    int sessionMinutes = Math.min(Math.min(remainingGoal, remainingSlot), MAX_SESSION_MINUTES);

                    if (sessionMinutes <= 0) break;

                    LocalDateTime sessionEnd = cursor.plusMinutes(sessionMinutes);

                    boolean overlap = studySessionRepository
                            .existsByUserAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                                    user, sessionEnd, cursor
                            );

                    if (!overlap) {
                        StudySession s = StudySession.builder()
                                .subject(subject)
                                .user(user)
                                .startDateTime(cursor)
                                .endDateTime(sessionEnd)
                                .isGenerated(true)
                                .build();
                        studySessionRepository.save(s);
                        created++;
                        planned += sessionMinutes;
                        totalMinutes += sessionMinutes;
                    }

                    cursor = sessionEnd.plusMinutes(5); // petite pause
                }
            }
        }

        String message = created > 0 
                ? "Planning généré avec succès : " + created + " sessions créées."
                : "Aucune session générée. Vérifiez que vous avez bien défini des matières, des objectifs d'heures et des disponibilités.";

        return GeneratePlanResponse.builder()
                .sessionsCreated(created)
                .totalMinutesPlanned(totalMinutes)
                .message(message)
                .build();
    }

    public List<StudySessionResponse> getWeekSessions(String email, LocalDate weekStart) {
        User user = userRepository.findByEmail(email).orElseThrow();
        LocalDateTime start = weekStart.atStartOfDay();
        LocalDateTime end = weekStart.plusDays(7).atStartOfDay();

        List<StudySession> sessions = studySessionRepository
                .findByUserAndStartDateTimeBetween(user, start, end);

        List<StudySessionResponse> out = new ArrayList<>();
        for (StudySession s : sessions) {
            out.add(StudySessionResponse.builder()
                    .id(s.getId())
                    .subjectId(s.getSubject().getId())
                    .subjectName(s.getSubject().getName())
                    .startDateTime(s.getStartDateTime())
                    .endDateTime(s.getEndDateTime())
                    .isGenerated(s.isGenerated())
                    .build());
        }
        return out;
    }

    private LocalDate resolveDateInWeek(LocalDate weekStart, DayOfWeekEnum day) {
        DayOfWeek target = DayOfWeek.valueOf(day.name());
        LocalDate d = weekStart;
        while (d.getDayOfWeek() != target) d = d.plusDays(1);
        return d;
    }
}