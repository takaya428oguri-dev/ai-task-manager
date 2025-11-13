package com.example.taskmanager.service;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    /**
     * 新規タスク作成
     */
    public Task createTask(Long userId, String title, String description, java.time.LocalDateTime dueDate) {
        Task newTask = Task.builder()
                .userId(userId)
                .title(title)
                .description(description)
                .dueDate(dueDate)
                .completed(false)
                .build();

        return taskRepository.save(newTask);
    }

    /**
     * ユーザーIDでタスク一覧を取得（新しい順）
     */
    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * タスクをIDで取得
     */
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    /**
     * タスク更新
     */
    public Task updateTask(Long id, Long userId, String title, String description, java.time.LocalDateTime dueDate, Boolean completed) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            throw new RuntimeException("タスクが見つかりません");
        }

        Task task = optionalTask.get();

        // 権限チェック（該当ユーザーのタスクのみ更新可能）
        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("このタスクを更新する権限がありません");
        }

        // フィールド更新
        task.setTitle(title);
        task.setDescription(description);
        task.setDueDate(dueDate);
        task.setCompleted(completed);

        return taskRepository.save(task);
    }

    /**
     * タスク削除
     */
    public void deleteTask(Long id, Long userId) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            throw new RuntimeException("タスクが見つかりません");
        }

        Task task = optionalTask.get();

        // 権限チェック（該当ユーザーのタスクのみ削除可能）
        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("このタスクを削除する権限がありません");
        }

        taskRepository.deleteById(id);
    }

    /**
     * 完了ステータス更新
     */
    public Task toggleTaskCompletion(Long id, Long userId) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isEmpty()) {
            throw new RuntimeException("タスクが見つかりません");
        }

        Task task = optionalTask.get();

        // 権限チェック
        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("このタスクを更新する権限がありません");
        }

        task.setCompleted(!task.getCompleted());
        return taskRepository.save(task);
    }
}
