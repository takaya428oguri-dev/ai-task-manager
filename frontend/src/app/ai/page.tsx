"use client";

import { useState } from "react";

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "こんにちは！AIタスクアシスタントです😊" },
  ]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="p-4 bg-white shadow-md text-xl font-bold text-gray-800">
        AIアシスタント
      </header>

      {/* チャットメインエリア */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                msg.role === "assistant"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-blue-500 text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </main>

      {/* 入力欄（まだ機能なし） */}
      <footer className="p-4 bg-white border-t">
        <input
          type="text"
          placeholder="メッセージを入力..."
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled
        />
      </footer>
    </div>
  );
}
