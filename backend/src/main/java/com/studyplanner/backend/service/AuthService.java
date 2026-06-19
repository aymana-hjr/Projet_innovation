package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.AuthResponse;
import com.studyplanner.backend.dto.LoginRequest;
import com.studyplanner.backend.dto.RegisterRequest;
import com.studyplanner.backend.entity.Role;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.repository.RoleRepository;
import com.studyplanner.backend.repository.UserRepository;
import com.studyplanner.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import com.studyplanner.backend.dto.VerificationRequest;

@Service

public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public AuthResponse register (RegisterRequest request){
        if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException(("Email already in use"));
        }
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(()->new RuntimeException("ROLE_USER not found"));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .roles(Set.of(userRole))
                .build();
        userRepository.save(user);

        String jwt = jwtService.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .email(user.getEmail())
                .requires2FA(false)
                .build();
    }

    public AuthResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Générer un code à 6 chiffres
        String code = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setVerificationCode(code);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // Envoyer le code par e-mail
        emailService.sendVerificationCode(user.getEmail(), code);

        return AuthResponse.builder()
                .requires2FA(true)
                .email(user.getEmail())
                .build();
    }

    public AuthResponse verifyCode(VerificationRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.getCode())) {
            throw new RuntimeException("Code de vérification incorrect");
        }

        if (user.getVerificationCodeExpiry() == null || user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code de vérification expiré");
        }

        // Vider le code et l'expiration après validation réussie
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);

        String jwt = jwtService.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .email(user.getEmail())
                .requires2FA(false)
                .build();
    }

    public void resendVerificationCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String code = String.format("%06d", new java.util.Random().nextInt(1000000));
        user.setVerificationCode(code);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendVerificationCode(user.getEmail(), code);
    }


}
