"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const PUBLIC_ROUTES = ["/login", "/signup", "/"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!user && !isPublicRoute) {
      // 未認証ユーザーが保護されたページにアクセス
      router.push("/login");
    } else if (user && (pathname === "/login" || pathname === "/signup")) {
      // 認証済みユーザーがログイン/登録ページにアクセス
      router.push("/tasks");
    }
  }, [user, isLoading, pathname, router, isMounted]);

  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isPublicRoute) {
    // ログイン/登録ページは標準レイアウトなし
    return <>{children}</>;
  }

  // タスク管理ページはナビゲーション付き
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-white overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
