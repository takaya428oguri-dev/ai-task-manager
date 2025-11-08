import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-4">AI Task Manager</h1>
      <p className="text-lg text-gray-700 mb-8">
        タスクを効率的に管理し、AIがあなたをサポートします。
      </p>

      <div className="flex flex-col items-center space-y-4">
        {/* タスク管理ページへのリンク（後で実装予定） */}
        <Link
          href="/tasks"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          タスク管理画面へ
        </Link>

        {/* AIアシスタント画面へのリンク */}
        <Link
          href="/ai"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          AIアシスタント画面へ
        </Link>
      </div>
    </main>
  );
}
