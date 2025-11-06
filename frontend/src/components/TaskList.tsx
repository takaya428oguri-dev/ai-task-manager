"use client";
import React, { useEffect, useState } from "react";
import { Task } from "@/types/Task";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import { v4 as uuidv4 } from "uuid";

export default function TaskList() {
  // ✅ localStorage から初期値を読み込む
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tasks");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // タスクが変わるたびに保存
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string) => {
    const newTask: Task = { id: uuidv4(), title, completed: false };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <TaskForm onAdd={addTask} />
      <ul>
        {tasks.length === 0 ? (
          <p className="text-gray-500">タスクがありません。</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </ul>
    </div>
  );
}
