package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TaskDTO;
import com.example.taskmanager.dto.CreateTaskRequest;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService taskService;

    /**
     * ユーザーの全タスク取得
     */
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasks(@RequestParam Long userId) {
        try {
            List<Task> tasks = taskService.getTasksByUserId(userId);
            List<TaskDTO> taskDTOs = tasks.stream()
                    .map(task -> TaskDTO.builder()
                            .id(task.getId())
                            .title(task.getTitle())
                            .description(task.getDescription())
                            .dueDate(task.getDueDate())
                            .completed(task.getCompleted())
                            .createdAt(task.getCreatedAt())
                            .updatedAt(task.getUpdatedAt())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(taskDTOs);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 新規タスク作成
     */
    @PostMapping
    public ResponseEntity<?> createTask(
            @RequestParam Long userId,
            @RequestBody CreateTaskRequest request) {
        try {
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("タスクのタイトルは必須です");
            }

            Task newTask = taskService.createTask(
                    userId,
                    request.getTitle(),
                    request.getDescription(),
                    request.getDueDate()
            );

            TaskDTO taskDTO = TaskDTO.builder()
                    .id(newTask.getId())
                    .title(newTask.getTitle())
                    .description(newTask.getDescription())
                    .dueDate(newTask.getDueDate())
                    .completed(newTask.getCompleted())
                    .createdAt(newTask.getCreatedAt())
                    .updatedAt(newTask.getUpdatedAt())
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(taskDTO);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("タスク作成に失敗しました: " + e.getMessage());
        }
    }

    /**
     * タスク更新
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody CreateTaskRequest request) {
        try {
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("タスクのタイトルは必須です");
            }

            Task updatedTask = taskService.updateTask(
                    id,
                    userId,
                    request.getTitle(),
                    request.getDescription(),
                    request.getDueDate(),
                    false  // completedは別エンドポイントで管理
            );

            TaskDTO taskDTO = TaskDTO.builder()
                    .id(updatedTask.getId())
                    .title(updatedTask.getTitle())
                    .description(updatedTask.getDescription())
                    .dueDate(updatedTask.getDueDate())
                    .completed(updatedTask.getCompleted())
                    .createdAt(updatedTask.getCreatedAt())
                    .updatedAt(updatedTask.getUpdatedAt())
                    .build();

            return ResponseEntity.ok(taskDTO);

        } catch (RuntimeException e) {
            if (e.getMessage().contains("権限")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("タスク更新に失敗しました: " + e.getMessage());
        }
    }

    /**
     * タスク削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            taskService.deleteTask(id, userId);
            return ResponseEntity.noContent().build();

        } catch (RuntimeException e) {
            if (e.getMessage().contains("権限")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("タスク削除に失敗しました: " + e.getMessage());
        }
    }

    /**
     * タスク完了ステータス切り替え
     */
    @PutMapping("/{id}/toggle-completion")
    public ResponseEntity<?> toggleTaskCompletion(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            Task updatedTask = taskService.toggleTaskCompletion(id, userId);

            TaskDTO taskDTO = TaskDTO.builder()
                    .id(updatedTask.getId())
                    .title(updatedTask.getTitle())
                    .description(updatedTask.getDescription())
                    .dueDate(updatedTask.getDueDate())
                    .completed(updatedTask.getCompleted())
                    .createdAt(updatedTask.getCreatedAt())
                    .updatedAt(updatedTask.getUpdatedAt())
                    .build();

            return ResponseEntity.ok(taskDTO);

        } catch (RuntimeException e) {
            if (e.getMessage().contains("権限")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ステータス更新に失敗しました: " + e.getMessage());
        }
    }
}
