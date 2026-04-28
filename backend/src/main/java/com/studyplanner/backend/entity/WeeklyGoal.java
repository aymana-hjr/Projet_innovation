package com.studyplanner.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "weekly_goals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WeeklyGoal {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @Column(nullable = false)
    private Integer targetMinutesPerWeek;
}