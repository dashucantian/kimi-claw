// 内存存储（后续可替换为SQLite/PostgreSQL）
const sessions = new Map();
const userSessions = new Map();
export class PracticeService {
    async startSession(params) {
        const session = {
            id: this.generateId(),
            userId: params.userId,
            startTime: new Date(),
            duration: params.duration,
            mode: params.mode,
            context: params.context,
            status: "active",
        };
        sessions.set(session.id, session);
        // 记录用户会话列表
        const userSessionList = userSessions.get(params.userId) || [];
        userSessionList.push(session.id);
        userSessions.set(params.userId, userSessionList);
        return session;
    }
    async endSession(sessionId, feedback) {
        const session = sessions.get(sessionId);
        if (!session)
            return null;
        const endTime = new Date();
        const actualDuration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
        session.endTime = endTime;
        session.actualDuration = actualDuration;
        session.status = "completed";
        session.feedback = feedback;
        sessions.set(sessionId, session);
        return session;
    }
    async getUserStats(userId, period) {
        const now = new Date();
        const startDate = new Date();
        switch (period) {
            case "week":
                startDate.setDate(now.getDate() - 7);
                break;
            case "month":
                startDate.setMonth(now.getMonth() - 1);
                break;
            case "year":
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        const userSessionIds = userSessions.get(userId) || [];
        const userPractices = userSessionIds
            .map(id => sessions.get(id))
            .filter((s) => s !== undefined &&
            s.status === "completed" &&
            s.startTime >= startDate);
        const totalSessions = userPractices.length;
        const totalDuration = userPractices.reduce((sum, p) => sum + (p.actualDuration || 0), 0);
        const averageQuality = totalSessions > 0
            ? userPractices.reduce((sum, p) => sum + (p.feedback?.quality || 0), 0) / totalSessions
            : 0;
        const streak = this.calculateStreak(userPractices);
        return {
            period,
            totalSessions,
            totalDuration,
            averageQuality: Math.round(averageQuality * 10) / 10,
            streak,
            practices: userPractices.map(p => ({
                id: p.id,
                date: p.startTime,
                duration: p.actualDuration,
                quality: p.feedback?.quality,
            })),
        };
    }
    calculateStreak(practices) {
        if (practices.length === 0)
            return 0;
        const dates = [...new Set(practices
                .map(p => p.startTime.toDateString()))]
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        let streak = 0;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (dates[0] === today || dates[0] === yesterday) {
            streak = 1;
            for (let i = 1; i < dates.length; i++) {
                const prevDate = new Date(dates[i - 1]);
                const currDate = new Date(dates[i]);
                const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
                if (diffDays === 1) {
                    streak++;
                }
                else {
                    break;
                }
            }
        }
        return streak;
    }
    generateId() {
        return `zg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
// 单例实例
export const practiceService = new PracticeService();
//# sourceMappingURL=PracticeService.js.map