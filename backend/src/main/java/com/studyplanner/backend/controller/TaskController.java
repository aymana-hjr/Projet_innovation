package com.studyplanner.backend.controller;

import com.studyplanner.backend.dto.TaskRequest;
import com.studyplanner.backend.dto.TaskResponse;
import com.studyplanner.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponse> getMyTasks(Principal principal) {
        return taskService.getMyTasks(principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(@Valid @RequestBody TaskRequest request, Principal principal) {
        return taskService.createTask(principal.getName(), request);
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(@PathVariable Long id,
                                   @Valid @RequestBody TaskRequest request,
                                   Principal principal) {
        return taskService.updateTask(principal.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id, Principal principal) {
        taskService.deleteTask(principal.getName(), id);
    }
}