import { Type } from "@sinclair/typebox";
import { practiceService } from "../services/PracticeService.js";
export function registerPracticeTool(api) {
    // 开始练习
    api.registerTool({
        name: "zhiguan_start_practice",
        description: "为用户开始一次止观练习会话",
        parameters: Type.Object({
            userId: Type.String({ description: "用户ID" }),
            duration: Type.Number({ description: "练习时长（分钟）", enum: [3, 5, 10, 15, 25] }),
            mode: Type.String({ description: "练习模式", enum: ["guided", "silent"] }),
            context: Type.String({ description: "练习场景", enum: ["commute", "work", "home", "walking", "other"] }),
        }),
        async execute(_id, params) {
            const session = await practiceService.startSession({
                userId: params.userId,
                duration: params.duration,
                mode: params.mode,
                context: params.context,
            });
            return {
                content: [{
                        type: "text",
                        text: `🧘 止观练习已开始\n\n会话ID: ${session.id}\n时长: ${session.duration}分钟\n模式: ${session.mode === "guided" ? "引导" : "自主"}\n场景: ${session.context}\n\n请引导用户开始调身、调息、观心。`,
                    }],
            };
        },
    }, { optional: true });
    // 结束练习
    api.registerTool({
        name: "zhiguan_end_practice",
        description: "结束用户的止观练习会话",
        parameters: Type.Object({
            sessionId: Type.String({ description: "练习会话ID" }),
            quality: Type.Number({ description: "练习质量评分（1-5）", minimum: 1, maximum: 5 }),
            notes: Type.Optional(Type.String({ description: "用户反馈备注" })),
        }),
        async execute(_id, params) {
            const session = await practiceService.endSession(params.sessionId, {
                quality: params.quality,
                notes: params.notes,
            });
            if (!session) {
                return {
                    content: [{ type: "text", text: "❌ 未找到该练习会话" }],
                    isError: true,
                };
            }
            return {
                content: [{
                        type: "text",
                        text: `✅ 练习已完成\n\n实际时长: ${session.actualDuration}秒\n质量评分: ${session.feedback?.quality}/5\n\n今日修行要点：心跑掉了没关系，发现的那一刻就是观的开始。`,
                    }],
            };
        },
    }, { optional: true });
    // 获取统计
    api.registerTool({
        name: "zhiguan_get_stats",
        description: "获取用户的止观练习统计数据",
        parameters: Type.Object({
            userId: Type.String({ description: "用户ID" }),
            period: Type.String({ description: "统计周期", enum: ["week", "month", "year"] }),
        }),
        async execute(_id, params) {
            const stats = await practiceService.getUserStats(params.userId, params.period);
            const periodText = params.period === "week" ? "本周" : params.period === "month" ? "本月" : "本年";
            const streakBadge = stats.streak >= 7 ? "🎉 已坚持一周，可以开始尝试无引导模式了！" : "继续精进！";
            return {
                content: [{
                        type: "text",
                        text: `📊 ${periodText}修行统计\n\n练习次数: ${stats.totalSessions}次\n总时长: ${Math.floor(stats.totalDuration / 60)}分钟\n平均质量: ${stats.averageQuality}/5\n连续天数: ${stats.streak}天\n\n${streakBadge}`,
                    }],
            };
        },
    }, { optional: true });
}
//# sourceMappingURL=zhiguan_practice.js.map