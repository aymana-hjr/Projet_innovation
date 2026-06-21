package com.studyplanner.backend.config;

import com.studyplanner.backend.entity.Role;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.repository.RoleRepository;
import com.studyplanner.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.bootstrap-email:admin@studyplanner.com}")
    private String adminEmail;

    @Value("${app.admin.bootstrap-password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_USER").build()));

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));

        boolean adminExists = userRepository.findAll().stream()
                .anyMatch(u -> u.getRoles().stream().anyMatch(r -> "ROLE_ADMIN".equals(r.getName())));

        if (!adminExists) {
            userRepository.findByEmail(adminEmail).ifPresentOrElse(
                    existing -> {
                        Set<Role> roles = new HashSet<>(existing.getRoles());
                        roles.add(adminRole);
                        existing.setRoles(roles);
                        userRepository.save(existing);
                        log.info("Utilisateur {} promu administrateur", adminEmail);
                    },
                    () -> {
                        User admin = User.builder()
                                .fullName("Administrateur")
                                .email(adminEmail)
                                .password(passwordEncoder.encode(adminPassword))
                                .enabled(true)
                                .roles(Set.of(userRole, adminRole))
                                .build();
                        userRepository.save(admin);
                        log.info("Compte administrateur créé : {}", adminEmail);
                    }
            );
        }
    }
}
