"use client";
import React, { useEffect, useState } from "react";
import { Task } from "@/types/Task";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { v4 as uuidv4 } from "uuid";

export default function TaskList() {
  // ✅ localStorage から初期値を読み込む（日時文字列を Date に復元）
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tasks");
      if (!stored) return [];
      try {
        const parsed = JSON.parse(stored) as any[];
        return parsed.map((t) => ({
          ...t,
          createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
          updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
        }));
      } catch (e) {
        console.error("tasks load error", e);
        return [];
      }
    }
    return [];
  });

  // 編集中のタスク（あるときはフォームが編集モードになる）
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // タスクが変わるたびに保存
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, dueDate?: Date | null) => {
    const now = new Date();
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
      dueDate: dueDate ?? null,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date() }
          : t
      )
    );
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
  };

  const updateTask = (id: string, title: string, dueDate?: Date | null) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, title, dueDate: dueDate ?? null, updatedAt: new Date() }
          : t
      )
    );
    setEditingTask(null);
  };

  const cancelEdit = () => setEditingTask(null);

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <TaskForm
        onAdd={addTask}
        onUpdate={updateTask}
        onCancel={cancelEdit}
        initialTask={editingTask ?? undefined}
      />

      {tasks.length === 0 ? (
        <p className="text-gray-500">タスクがありません。</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={startEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
