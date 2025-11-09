package com.example.taskmanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class OpenAiService {

    private final String apiKey;
    private final HttpClient httpClient;

    public OpenAiService(@Value("${openai.api.key}") String apiKey) {
        this.apiKey = apiKey;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * 簡易的にOpenAI Chat CompletionsエンドポイントへHTTPで問い合わせます。
     * 注意: SDKを使わずに生のHTTP呼び出しを行っているため、将来的にはSDKへ置き換えることを推奨します。
     */
    public String getChatResponse(String prompt) {
        String body = buildRequestBody(prompt);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            // ここでは簡易的にレスポンス本文全体を返します。必要ならJSONをパースして本文のみ抽出する処理を追加してください。
            return response.body();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return "Request interrupted";
        } catch (IOException e) {
            return "IO error: " + e.getMessage();
        }
    }

    private String buildRequestBody(String prompt) {
        // シンプルなJSONボディ。必要に応じてmessagesの構造を変更してください。
        String escaped = escapeJson(prompt);
        return "{\"model\":\"gpt-3.5-turbo\",\"messages\":[{\"role\":\"user\",\"content\":\"" + escaped + "\"}]}";
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '\"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < 0x20 || c > 0x7e) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
            }
        }
        return sb.toString();
    }
}
