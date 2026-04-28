package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.SubjectRequest;
import com.studyplanner.backend.dto.SubjectResponse;
import com.studyplanner.backend.entity.Subject;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.repository.SubjectRepository;
import com.studyplanner.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public List<SubjectResponse> getSubjects(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return subjectRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubjectResponse createSubject(String email, SubjectRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Subject subject = Subject.builder()
                .name(request.getName())
                .priority(request.getPriority())
                .user(user)
                .build();
        return mapToResponse(subjectRepository.save(subject));
    }

    @Transactional
    public void deleteSubject(String email, Long id) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Subject subject = subjectRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        subjectRepository.delete(subject);
    }

    private SubjectResponse mapToResponse(Subject s) {
        return SubjectResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .priority(s.getPriority())
                .build();
    }
}
