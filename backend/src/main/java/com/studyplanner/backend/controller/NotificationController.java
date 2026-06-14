package com.studyplanner.backend.controller;

import com.studyplanner.backend.entity.Notification;
import com.studyplanner.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications(Principal principal) {
        return notificationService.getNotificationsForUser(principal.getName());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Principal principal) {
        return Map.of("count", notificationService.getUnreadCount(principal.getName()));
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @PostMapping("/read-all")
    public void markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
    }
}
