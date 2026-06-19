package com.studyplanner.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationCode(String toEmail, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Code de vérification StudyPlanner");
            message.setText("Bonjour,\n\nVotre code de vérification pour vous connecter à StudyPlanner est : " 
                    + code + "\n\nCe code expirera dans 5 minutes.\n\nCordialement,\nL'équipe StudyPlanner");
            mailSender.send(message);
            log.info("Email de vérification envoyé avec succès à {}", toEmail);
        } catch (Exception e) {
            log.error("ERREUR DE CONFIGURATION MAIL : Impossible d'envoyer l'email à {}.", toEmail);
            log.warn("=================================================");
            log.warn("--- CODE DE VÉRIFICATION GÉNÉRÉ POUR LE TEST : [{}] ---", code);
            log.warn("=================================================");
        }
    }
}
