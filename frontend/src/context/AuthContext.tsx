"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/types/Auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // マウント時にlocalStorageからユーザー情報を復元
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt),
        });
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // ローカルストレージからユーザーを検索
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: any) => u.username === username && u.password === password);

      if (!foundUser) {
        throw new Error("ユーザー名またはパスワードが正しくありません");
      }

      const authUser: User = {
        id: foundUser.id,
        username: foundUser.username,
        createdAt: new Date(foundUser.createdAt),
      };

      setUser(authUser);
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // 既存ユーザーをチェック
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u: any) => u.username === username)) {
        throw new Error("このユーザー名は既に使用されています");
      }

      // 新規ユーザーを作成
      const newUser = {
        id: Math.random().toString(36).substring(2, 11),
        username,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // ログイン状態に
      const authUser: User = {
        id: newUser.id,
        username: newUser.username,
        createdAt: new Date(newUser.createdAt),
      };
      setUser(authUser);
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
