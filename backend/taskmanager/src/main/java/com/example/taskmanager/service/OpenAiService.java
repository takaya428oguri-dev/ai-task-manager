package com.example.taskmanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class OpenAiService {

    private final String apiKey;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public OpenAiService(@Value("${openai.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * OpenAI Chat Completions API を使用してテキスト生成を行います。
     * @param prompt ユーザーからのプロンプト
     * @return OpenAI からのレスポンステキスト
     */
    public String getChatResponse(String prompt) {
        try {
            String requestBody = buildRequestBody(prompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() == 200) {
                return extractContentFromResponse(response.body());
            } else {
                return "Error: HTTP " + response.statusCode() + " - " + response.body();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "Error: Request interrupted";
        } catch (IOException e) {
            return "Error: IO error - " + e.getMessage();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    /**
     * リクエストボディをJSON形式で構築します。
     */
    private String buildRequestBody(String prompt) throws Exception {
        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("model", "gpt-3.5-turbo");
        requestMap.put("temperature", 0.7);
        requestMap.put("max_tokens", 1000);

        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(message);
        requestMap.put("messages", messages);

        return objectMapper.writeValueAsString(requestMap);
    }

    /**
     * レスポンスから最初の choice のメッセージコンテンツを抽出します。
     */
    private String extractContentFromResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode choices = root.get("choices");

        if (choices != null && choices.isArray() && choices.size() > 0) {
            JsonNode firstChoice = choices.get(0);
            JsonNode message = firstChoice.get("message");
            if (message != null) {
                JsonNode content = message.get("content");
                if (content != null) {
                    return content.asText();
                }
            }
        }

        return "No response received";
    }
}
