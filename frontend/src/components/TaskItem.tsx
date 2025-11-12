"use client";
import React, { useState } from "react";
import { Task } from "@/types/Task";
import { getDueDateStatus, getDueDateClasses, getDueDateIcon } from "@/lib/dueDateUtils";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

const DESCRIPTION_PREVIEW_LENGTH = 80;

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [expandDescription, setExpandDescription] = useState(false);
  const dueDateStatus = getDueDateStatus(task.dueDate);
  const dueDateClasses = getDueDateClasses(dueDateStatus);
  const { icon: dueDateIcon, label: dueDateLabel } = getDueDateIcon(dueDateStatus);

  // 説明が長い場合は省略するか判定
  const hasLongDescription =
    task.description && task.description.length > DESCRIPTION_PREVIEW_LENGTH;
  const displayDescription = expandDescription
    ? task.description
    : task.description?.slice(0, DESCRIPTION_PREVIEW_LENGTH);

  // 完了済みなら通常のスタイル、未完了なら期日の状態に応じたスタイル
  const cardClasses = task.completed
    ? "bg-green-50 border-green-200"
    : dueDateClasses;

  return (
    <li
      className={`rounded-lg p-4 mb-4 shadow-sm transition-colors border ${cardClasses} hover:shadow-md`}
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
            <div className="flex items-center gap-2">
              <p
                className={`text-sm font-medium ${
                  task.completed ? "line-through text-green-800" : "text-gray-900"
                }`}
              >
                {task.title}
              </p>
              {!task.completed && dueDateIcon && (
                <span
                  className="text-lg"
                  title={dueDateLabel}
                  aria-label={dueDateLabel}
                >
                  {dueDateIcon}
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              作成: {new Date(task.createdAt).toLocaleString("ja-JP")}
              {task.updatedAt > task.createdAt && (
                <span className="ml-2">
                  更新: {new Date(task.updatedAt).toLocaleString("ja-JP")}
                </span>
              )}
              {task.dueDate && (
                <div className="mt-2 flex items-center gap-1">
                  {dueDateIcon && <span className="text-sm">{dueDateIcon}</span>}
                  <span className="font-medium">期限:</span>
                  <span>{new Date(task.dueDate).toLocaleString("ja-JP")}</span>
                  {dueDateLabel && <span className="ml-1 font-semibold text-xs">({dueDateLabel})</span>}
                </div>
              )}
            </div>
            {task.description && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700 border-l-2 border-indigo-300">
                <p className="whitespace-pre-wrap break-words">
                  {displayDescription}
                  {hasLongDescription && !expandDescription && "..."}
                </p>
                {hasLongDescription && (
                  <button
                    onClick={() => setExpandDescription(!expandDescription)}
                    className="mt-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                  >
                    {expandDescription ? "折りたたむ" : "全文表示"}
                  </button>
                )}
              </div>
            )}
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
