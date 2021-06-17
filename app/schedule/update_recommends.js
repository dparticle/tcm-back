'use strict';

const Subscription = require('egg').Subscription;

class UpdateRecommends extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 8 * * *', // 每天 8 点执行一次
      immediate: true, // 在应用启动并 ready 后立刻执行一次
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx, service } = this;
    ctx.logger.info(service.time.getNowFormatDate() + ' recommend tcms task begin');
    await service.recommends.createTcms();
    ctx.logger.info(service.time.getNowFormatDate() + ' recommend articles task begin');
    await service.recommends.fetchArticles();
  }
}

module.exports = UpdateRecommends;
