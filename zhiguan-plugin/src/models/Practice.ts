// 练习记录数据模型
export interface PracticeSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // 计划时长（分钟）
  actualDuration?: number; // 实际时长（秒）
  mode: "guided" | "silent";
  context: "commute" | "work" | "home" | "walking" | "other";
  status: "active" | "completed" | "interrupted";
  feedback?: {
    quality: 1 | 2 | 3 | 4 | 5;
    notes?: string;
  };
}

// 用户统计
export interface UserStats {
  period: "week" | "month" | "year";
  totalSessions: number;
  totalDuration: number; // 秒
  averageQuality: number;
  streak: number; // 连续天数
  practices: {
    id: string;
    date: Date;
    duration?: number;
    quality?: number;
  }[];
}
