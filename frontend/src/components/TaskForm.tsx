"use client";
import React, { useEffect, useState } from "react";
import { Task } from "@/types/Task";

interface TaskFormProps {
  onAdd: (title: string, dueDate?: Date | null, description?: string) => void;
  onUpdate?: (id: string, title: string, dueDate?: Date | null, description?: string) => void;
  onCancel?: () => void;
  initialTask?: Task | null;
}

export default function TaskForm({ onAdd, onUpdate, onCancel, initialTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  // datetime-local value as string like "2025-11-11T13:00"
  const [due, setDue] = useState<string>("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title ?? "");
      setDue(initialTask.dueDate ? toDatetimeLocal(initialTask.dueDate) : "");
      setDescription(initialTask.description ?? "");
      setError(null);
    } else {
      setTitle("");
      setDue("");
      setDescription("");
      setError(null);
    }
  }, [initialTask]);

  function toDatetimeLocal(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("タイトルは必須です。");
      return;
    }

    let dueDate: Date | null | undefined = undefined;
    if (due) {
      const parsed = new Date(due);
      if (isNaN(parsed.getTime())) {
        setError("期日の形式が不正です。");
        return;
      }
      const now = new Date();
      if (parsed < now) {
        setError("期日は現在より未来の日付を指定してください。");
        return;
      }
      dueDate = parsed;
    } else {
      dueDate = null;
    }

    const desc = description.trim();

    if (initialTask && onUpdate) {
      onUpdate(initialTask.id, trimmed, dueDate, desc || undefined);
    } else {
      onAdd(trimmed, dueDate ?? null, desc || undefined);
    }

    // clear when adding (if in edit mode, parent will clear initialTask)
    if (!initialTask) {
      setTitle("");
      setDue("");
      setDescription("");
      setError(null);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タスクのタイトル"
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="datetime-local"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none"
            aria-label="期日"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition shadow-sm"
          >
            {initialTask ? "保存" : "追加"}
          </button>
          {initialTask && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-600 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              キャンセル
            </button>
          )}
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="詳細事項を入力（オプション）"
          className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={3}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>
    </div>
  );
}
