"use client";
import React from "react";
import { Task } from "@/types/Task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  return (
    <li
      className={`rounded-lg p-4 mb-4 shadow-sm transition-colors border ${
        task.completed
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-100 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="h-5 w-5 rounded-md cursor-pointer text-indigo-600 focus:ring-indigo-500 mt-1"
          />
          <div>
            <p
              className={`text-sm font-medium ${
                task.completed ? "line-through text-green-800" : "text-gray-900"
              }`}
            >
              {task.title}
            </p>
            <div className="mt-1 text-xs text-gray-500">
              作成: {new Date(task.createdAt).toLocaleString("ja-JP")}
              {task.updatedAt > task.createdAt && (
                <span className="ml-2">
                  更新: {new Date(task.updatedAt).toLocaleString("ja-JP")}
                </span>
              )}
              {task.dueDate && (
                <div className="mt-1">
                  <span className="text-xs font-medium">期限: </span>
                  <span className="text-xs">{new Date(task.dueDate).toLocaleString("ja-JP")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded-md"
              title="編集"
              aria-label={`Edit ${task.title}`}
            >
              ✎
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700 px-2 py-1 rounded-md"
            aria-label={`Delete ${task.title}`}
          >
            ✕
          </button>
          </div>
      </div>
    </li>
  );
}
