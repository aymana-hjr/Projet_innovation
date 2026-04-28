package com.studyplanner.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_groups")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,length = 120)
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name="owner_id",nullable = false)
    private User owner;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
