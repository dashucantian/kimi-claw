// pages/stats/stats.js
const app = getApp();

Page({
  data: {
    totalSessions: 0,
    totalHours: 0,
    currentStreak: 0,
    weeklyCount: 0,
    weeklyMinutes: 0,
    weekDays: [],
    history: []
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  // 加载统计数据
  loadStats() {
    const history = app.globalData.practiceHistory;

    // 总练习次数
    const totalSessions = history.length;

    // 总小时数
    const totalMinutes = history.reduce((sum, r) => sum + (r.duration || 0), 0);
    const totalHours = Math.floor(totalMinutes / 60 * 10) / 10;

    // 连续天数
    const currentStreak = app.getStreak();

    // 本周统计
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const weeklyPractices = history.filter(r => new Date(r.date) > weekAgo);
    const weeklyCount = weeklyPractices.length;
    const weeklyMinutes = Math.floor(
      weeklyPractices.reduce((sum, r) => sum + (r.duration || 0), 0) / 60
    );

    // 生成周历数据
    const weekDays = this.generateWeekDays(history);

    // 格式化历史记录
    const formattedHistory = this.formatHistory(history.slice(0, 20));

    this.setData({
      totalSessions,
      totalHours,
      currentStreak,
      weeklyCount,
      weeklyMinutes,
      weekDays,
      history: formattedHistory
    });
  },

  // 生成周历
  generateWeekDays(history) {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const today = new Date();
    const weekDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toDateString();
      const dayPractices = history.filter(r =>
        new Date(r.date).toDateString() === dateStr
      );

      weekDays.push({
        name: days[date.getDay()],
        hasPractice: dayPractices.length > 0,
        count: dayPractices.length
      });
    }

    return weekDays;
  },

  // 格式化历史记录
  formatHistory(history) {
    return history.map(record => {
      const date = new Date(record.date);
      const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

      return {
        ...record,
        day: date.getDate(),
        month: months[date.getMonth()],
        duration: Math.floor((record.duration || 0) / 60),
        modeText: record.mode === 'guided' ? '引导练习' : '自主练习',
        stars: '★'.repeat(record.rating || 0) + '☆'.repeat(5 - (record.rating || 0))
      };
    });
  },

  // 清空历史
  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有练习记录吗？此操作不可恢复。',
      confirmColor: '#f44336',
      success: (res) => {
        if (res.confirm) {
          app.globalData.practiceHistory = [];
          wx.setStorageSync('zhiguan_history', []);
          this.loadStats();

          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  }
});
