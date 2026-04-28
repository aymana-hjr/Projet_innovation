package com.studyplanner.backend.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
       name = "group_members",
       uniqueConstraints = {
               @UniqueConstraint(columnNames = {"group_id","user_id"})
       }
)

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="group_id",nullable=false)
    private StudyGroup group;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="user_id",nullable= false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 20)
    private GroupRole role;

    @Column(nullable = false)
    private LocalDateTime joinedAt;
}
