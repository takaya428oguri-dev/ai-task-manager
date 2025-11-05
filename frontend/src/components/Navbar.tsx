"use client";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <h1 className="text-xl font-bold">AI Task Manager</h1>
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
          🤖 AIアシスト
        </button>
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-sm">U</span>
        </div>
      </div>
    </nav>
  );
}
