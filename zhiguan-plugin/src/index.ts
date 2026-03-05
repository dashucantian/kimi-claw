import { registerPracticeTool } from "./tools/zhiguan_practice.js";

export interface ZhiguanConfig {
  database?: { type: "sqlite" | "postgres"; connection?: string };
  content?: { path?: string; cdnUrl?: string };
  features?: { wearable?: boolean; eeg?: boolean; vr?: boolean; analytics?: boolean };
}

const plugin = {
  id: "zhiguan",
  name: "止观AI",
  description: "传统止观禅修数字化系统",
  version: "0.1.0",

  async register(api: any) {
    const config = api.config.plugins?.entries?.zhiguan?.config as ZhiguanConfig || {};

    // 注册Agent工具
    registerPracticeTool(api);

    // 注册Slash命令
    api.registerCommand({
      name: "zhiguan",
      description: "开始一次3分钟止观练习",
      handler: async (ctx: any) => {
        const userId = ctx.user?.id || "anonymous";
        return {
          text: `🧘 止观练习\n\n请使用工具开始练习，或访问止观AI应用。\n\n今日修行要点：数息时，知道自己在数息；心跑掉了，拉回来就好。`,
        };
      },
    });

    api.registerCommand({
      name: "zhiguan-stats",
      description: "查看修行统计",
      handler: async (ctx: any) => {
        return {
          text: "📊 请使用 zhiguan_get_stats 工具查看详细统计",
        };
      },
    });

    api.logger.info("✅ 止观AI插件 v0.1.0 加载完成");
  },
};

export default plugin;
