package com.example.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import com.example.taskmanager.service.OpenAiService;
import java.util.HashMap;
import java.util.Map;

@RestController
@ConditionalOnProperty(prefix = "openai", name = "enabled", havingValue = "true", matchIfMissing = false)
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final OpenAiService openAiService;

    public ChatController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Message is required");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        String response = openAiService.getChatResponse(message);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("response", response);
        return ResponseEntity.ok(result);
    }
}
