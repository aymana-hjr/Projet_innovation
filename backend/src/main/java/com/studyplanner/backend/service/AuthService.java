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

import java.util.Set;

@Service

public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
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
                .build();
    }
    public AuthResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        String jwt = jwtService.generateToken(request.getEmail());
        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .email(request.getEmail())
                .build();
    }


}
