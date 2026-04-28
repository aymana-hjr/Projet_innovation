package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.TaskRequest;
import com.studyplanner.backend.dto.TaskResponse;
import com.studyplanner.backend.entity.Task;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.repository.TaskRepository;
import com.studyplanner.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;


    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
    public List<TaskResponse> getMyTasks(String email){
        User user = getUserByEmail(email);
        return taskRepository.findByUserOrderByDueDateAsc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse createTask(String email, TaskRequest request){
        User user =getUserByEmail(email);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .user(user)
                .build();
        return toResponse(taskRepository.save(task));
    }
    public TaskResponse updateTask(String email,Long taskId,TaskRequest request){
        User user =getUserByEmail(email);
        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new RuntimeException("Task not found or does not belong to current user"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        return toResponse(taskRepository.save(task));
    }
    public void deleteTask(String email,Long taskId){
        User user = getUserByEmail(email);
        Task task = taskRepository.findByIdAndUser(taskId,user)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.delete(task);

    }
    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .build();
    }
}
