/**
 * 期日状態を判定するユーティリティ
 */

export type DueDateStatus = "overdue" | "urgent" | "soon" | "normal" | "no-due-date";

/**
 * 現在時刻を基準に、期日の状態を判定する
 * - overdue: 期日を過ぎている
 * - urgent: 24時間以内（期日まで24時間以下）
 * - soon: 24〜48時間以内
 * - normal: 48時間以上先
 * - no-due-date: 期日なし
 */
export function getDueDateStatus(dueDate: Date | null | undefined): DueDateStatus {
  if (!dueDate) return "no-due-date";

  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) return "overdue";
  if (diffHours <= 24) return "urgent";
  if (diffHours <= 48) return "soon";
  return "normal";
}

/**
 * 期日の状態に基づいて、背景と枠線のCSSクラスを返す
 */
export function getDueDateClasses(status: DueDateStatus): string {
  switch (status) {
    case "overdue":
      return "bg-red-50 border-red-200";
    case "urgent":
      return "bg-orange-50 border-orange-200";
    case "soon":
      return "bg-yellow-50 border-yellow-200";
    case "normal":
      return "bg-white border-gray-100";
    case "no-due-date":
      return "bg-white border-gray-100";
  }
}

/**
 * 期日の状態に基づいて、アイコンと説明を返す
 */
export function getDueDateIcon(status: DueDateStatus): { icon: string; label: string } {
  switch (status) {
    case "overdue":
      return { icon: "🔴", label: "期日超過" };
    case "urgent":
      return { icon: "⚠️", label: "緊急" };
    case "soon":
      return { icon: "⏰", label: "まもなく" };
    case "normal":
      return { icon: "", label: "" };
    case "no-due-date":
      return { icon: "", label: "" };
  }
}
