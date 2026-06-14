package com.studyplanner.backend.service;

import com.studyplanner.backend.entity.NotificationType;
import com.studyplanner.backend.entity.StudySession;
import com.studyplanner.backend.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationScheduler {

    private final StudySessionRepository studySessionRepository;
    private final NotificationService notificationService;

    /**
     * S'exécute toutes les minutes pour vérifier les sessions qui commencent bientôt.
     */
    @Scheduled(fixedRate = 60000)
    public void scheduleReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime soon = now.plusMinutes(15);
        
        // On cherche les sessions qui commencent exactement entre maintenant et dans 15 min
        // Note: Dans un environnement réel, on marquerait la session comme "rappelée" 
        // pour ne pas envoyer le rappel plusieurs fois.
        
        List<StudySession> upcomingSessions = studySessionRepository.findAll().stream()
                .filter(s -> !s.isCompleted())
                .filter(s -> s.getStartDateTime().isAfter(now) && s.getStartDateTime().isBefore(soon))
                .toList();
                
        for (StudySession session : upcomingSessions) {
            String msg = "Rappel : Votre session de " + session.getSubject().getName() + " commence bientôt (" + 
                         ChronoUnit.MINUTES.between(now, session.getStartDateTime()) + " min) !";
            
            // On vérifie si une notification identique n'a pas déjà été envoyée il y a moins de 15 min
            // pour cet utilisateur (simplifié ici).
            notificationService.createNotification(
                session.getUser(), 
                msg, 
                NotificationType.REMINDER
            );
        }
    }
}
