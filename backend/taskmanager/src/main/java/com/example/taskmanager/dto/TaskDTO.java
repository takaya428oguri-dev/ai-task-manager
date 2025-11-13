package com.example.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
