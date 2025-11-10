import TaskList from "@/components/TaskList";

export default function TasksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900">タスク一覧</h2>
        <p className="text-sm text-gray-500">あなたのタスクを整理しましょう</p>
      </div>

      <TaskList />
    </div>
  );
}

