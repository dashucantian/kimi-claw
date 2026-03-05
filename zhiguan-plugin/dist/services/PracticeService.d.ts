import type { PracticeSession, UserStats } from "../models/Practice.js";
export declare class PracticeService {
    startSession(params: {
        userId: string;
        duration: 3 | 5 | 10 | 15 | 25;
        mode: "guided" | "silent";
        context: string;
    }): Promise<PracticeSession>;
    endSession(sessionId: string, feedback?: {
        quality: 1 | 2 | 3 | 4 | 5;
        notes?: string;
    }): Promise<PracticeSession | null>;
    getUserStats(userId: string, period: "week" | "month" | "year"): Promise<UserStats>;
    private calculateStreak;
    private generateId;
}
export declare const practiceService: PracticeService;
//# sourceMappingURL=PracticeService.d.ts.map