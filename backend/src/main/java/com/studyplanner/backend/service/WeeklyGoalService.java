package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.WeeklyGoalRequest;
import com.studyplanner.backend.entity.Subject;
import com.studyplanner.backend.entity.WeeklyGoal;
import com.studyplanner.backend.repository.SubjectRepository;
import com.studyplanner.backend.repository.WeeklyGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeeklyGoalService {

    private final WeeklyGoalRepository weeklyGoalRepository;
    private final SubjectRepository subjectRepository;

    public List<WeeklyGoal> getGoals(String email) {
        // En vrai, on pourrait filtrer par user via les subjects, 
        // mais simplifions pour cette V1.
        return weeklyGoalRepository.findAll();
    }

    @Transactional
    public void saveGoal(String email, WeeklyGoalRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        // Update existing or create new
        WeeklyGoal goal = weeklyGoalRepository.findBySubject(subject)
                .orElse(new WeeklyGoal());
        
        goal.setSubject(subject);
        goal.setTargetMinutesPerWeek(request.getTargetMinutesPerWeek());
        
        weeklyGoalRepository.save(goal);
    }
}
