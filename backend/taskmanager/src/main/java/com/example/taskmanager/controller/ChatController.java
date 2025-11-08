package com.example.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String aiResponse = "AIが受け取ったメッセージ: " + userMessage;

        Map<String, String> response = new HashMap<>();
        response.put("reply", aiResponse);
        return response;
    }
}