"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "ホーム" },
    { href: "/tasks", label: "タスク一覧" },
    { href: "/ai", label: "AIアシスト" },
  ];

  return (
    <aside className="w-60 bg-gray-100 h-[calc(100vh-56px)] p-4 border-r">
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition ${
              pathname === link.href
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
