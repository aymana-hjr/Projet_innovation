package com.studyplanner.backend.controller;

import com.studyplanner.backend.dto.admin.GlobalStatsResponse;
import com.studyplanner.backend.dto.admin.UpdateUserRequest;
import com.studyplanner.backend.dto.admin.UserAdminResponse;
import com.studyplanner.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public GlobalStatsResponse getGlobalStats() {
        return adminService.getGlobalStats();
    }

    @GetMapping("/users")
    public List<UserAdminResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PutMapping("/users/{id}")
    public UserAdminResponse updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request,
            Principal principal
    ) {
        return adminService.updateUser(id, request, principal.getName());
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id, Principal principal) {
        adminService.deleteUser(id, principal.getName());
    }
}
