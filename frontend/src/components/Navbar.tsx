"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <h1 className="text-xl font-bold">AI Task Manager</h1>
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
          🤖 AIアシスト
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">{user?.username.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-sm text-gray-300">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-200 text-sm transition"
          >
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  );
}
