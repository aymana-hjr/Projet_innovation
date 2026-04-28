package com.studyplanner.backend.dto;

import com.studyplanner.backend.entity.DayOfWeekEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter @Setter
public class AvailabilityRequest {
    @NotNull(message = "Le jour est requis")
    private DayOfWeekEnum dayOfWeek;

    @NotNull(message = "L'heure de début est requise")
    private LocalTime startTime;

    @NotNull(message = "L'heure de fin est requise")
    private LocalTime endTime;
}
