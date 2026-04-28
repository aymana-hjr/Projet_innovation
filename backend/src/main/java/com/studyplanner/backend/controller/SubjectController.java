package com.studyplanner.backend.controller;

import com.studyplanner.backend.dto.SubjectRequest;
import com.studyplanner.backend.dto.SubjectResponse;
import com.studyplanner.backend.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getAll(Authentication auth) {
        return ResponseEntity.ok(subjectService.getSubjects(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<SubjectResponse> create(Authentication auth, @Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.ok(subjectService.createSubject(auth.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        subjectService.deleteSubject(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
