"use client";
import React, { useEffect, useState } from "react";
import { Task } from "@/types/Task";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { v4 as uuidv4 } from "uuid";

export default function TaskList() {
  // ✅ クライアント側のみで状態を管理
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 編集中のタスク（あるときはフォームが編集モードになる）
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // マウント後に localStorage から読み込む
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as any[];
        const tasks = parsed.map((t) => ({
          ...t,
          createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
          updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
        }));
        setTasks(tasks);
      } catch (e) {
        console.error("tasks load error", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // タスクが変わるたびに保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = (title: string, dueDate?: Date | null, description?: string) => {
    const now = new Date();
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
      dueDate: dueDate ?? null,
      description: description ?? null,
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

  const updateTask = (id: string, title: string, dueDate?: Date | null, description?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, title, dueDate: dueDate ?? null, description: description ?? null, updatedAt: new Date() }
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

      {!isLoaded ? (
        <p className="text-gray-400">読み込み中...</p>
      ) : tasks.length === 0 ? (
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
