package com.studyplanner.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "shared_sessions",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"group_id", "study_session_id"})
        }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SharedSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroup group;

    // suppose que ton entité de 2.2 s'appelle StudySession
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "study_session_id", nullable = false)
    private StudySession studySession;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shared_by_user_id", nullable = false)
    private User sharedByUser;

    @Column(nullable = false)
    private LocalDateTime sharedAt;
}