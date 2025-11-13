package com.example.taskmanager.controller;

import com.example.taskmanager.dto.LoginRequest;
import com.example.taskmanager.dto.AuthResponse;
import com.example.taskmanager.dto.UserDTO;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * ユーザー登録
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {
        try {
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.builder()
                                .success(false)
                                .message("ユーザー名は必須です")
                                .build());
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.builder()
                                .success(false)
                                .message("パスワードは必須です")
                                .build());
            }

            User newUser = userService.register(request.getUsername(), request.getPassword());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(AuthResponse.builder()
                            .userId(newUser.getId())
                            .username(newUser.getUsername())
                            .success(true)
                            .message("ユーザー登録に成功しました")
                            .build());

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    /**
     * ログイン
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.builder()
                                .success(false)
                                .message("ユーザー名は必須です")
                                .build());
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.builder()
                                .success(false)
                                .message("パスワードは必須です")
                                .build());
            }

            User user = userService.login(request.getUsername(), request.getPassword());

            return ResponseEntity.ok(AuthResponse.builder()
                    .userId(user.getId())
                    .username(user.getUsername())
                    .success(true)
                    .message("ログインに成功しました")
                    .build());

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build());
        }
    }

    /**
     * ユーザー情報取得
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User foundUser = user.get();
        return ResponseEntity.ok(UserDTO.builder()
                .id(foundUser.getId())
                .username(foundUser.getUsername())
                .build());
    }
}
