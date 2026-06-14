package com.studyplanner.backend.controller;

import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public Map<String,Object> me(Authentication authentication){
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getCollaborationCode() == null) {
            user.setCollaborationCode(generateRandomCode());
            userRepository.save(user);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("fullName", user.getFullName());
        response.put("email", email);
        response.put("authorities", authentication.getAuthorities());
        response.put("collaborationCode", user.getCollaborationCode());
        
        return response;
    }

    private String generateRandomCode() {
        Random random = new Random();
        int code = 10000000 + random.nextInt(90000000); // 8-digit random number
        return String.valueOf(code);
    }
}
