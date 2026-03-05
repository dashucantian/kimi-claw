export interface PracticeSession {
    id: string;
    userId: string;
    startTime: Date;
    endTime?: Date;
    duration: number;
    actualDuration?: number;
    mode: "guided" | "silent";
    context: "commute" | "work" | "home" | "walking" | "other";
    status: "active" | "completed" | "interrupted";
    feedback?: {
        quality: 1 | 2 | 3 | 4 | 5;
        notes?: string;
    };
}
export interface UserStats {
    period: "week" | "month" | "year";
    totalSessions: number;
    totalDuration: number;
    averageQuality: number;
    streak: number;
    practices: {
        id: string;
        date: Date;
        duration?: number;
        quality?: number;
    }[];
}
//# sourceMappingURL=Practice.d.ts.map