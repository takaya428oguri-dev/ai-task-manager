package com.example.taskmanager.service;

import com.example.taskmanager.entity.User;
import com.example.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * ユーザー登録
     */
    public User register(String username, String password) {
        // ユーザー名の重複チェック
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new RuntimeException("このユーザー名は既に使用されています");
        }

        // 新規ユーザー作成
        User newUser = User.builder()
                .username(username)
                .password(password)
                .build();

        return userRepository.save(newUser);
    }

    /**
     * ログイン検証
     */
    public User login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            throw new RuntimeException("ユーザーが見つかりません");
        }

        User foundUser = user.get();
        if (!foundUser.getPassword().equals(password)) {
            throw new RuntimeException("パスワードが正しくありません");
        }

        return foundUser;
    }

    /**
     * ユーザーをIDで取得
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * ユーザーをユーザー名で取得
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * 全ユーザーを取得
     */
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
