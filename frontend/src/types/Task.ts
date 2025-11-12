export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 期日: 任意。nullまたはDate。
  dueDate?: Date | null;
  // 説明: 詳細事項。任意。
  description?: string | null;
}