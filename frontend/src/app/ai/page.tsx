"use client";

import { useState } from "react";

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "こんにちは！AIタスクアシスタントです😊" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // メッセージ送信処理
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // ダミーAI応答（本番はAPI連携予定）
    setTimeout(() => {
      const aiMessage = {
        role: "assistant",
        content: `あなたのメッセージ「${userMessage.content}」を受け取りました！`,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="p-4 bg-white shadow-md text-xl font-bold text-gray-800">
        AIアシスタント
      </header>

      {/* チャットエリア */}
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

        {isLoading && (
          <div className="text-gray-500 text-sm animate-pulse">
            AIが考え中です...
          </div>
        )}
      </main>

      {/* 入力欄 */}
      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isLoading}
          >
            送信
          </button>
        </form>
      </footer>
    </div>
  );
}
