export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 期日: 任意。nullまたはDate。
  dueDate?: Date | null;
}