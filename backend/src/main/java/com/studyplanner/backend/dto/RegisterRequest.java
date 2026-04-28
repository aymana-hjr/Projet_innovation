package com.studyplanner.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {



    @NotBlank
    private String fullName;



    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;


}
