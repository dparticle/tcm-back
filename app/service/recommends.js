'use strict';

const { Service } = require('egg');

class RecommendsService extends Service {
  async index(query) {
    let sql;
    if (query.type === 'tcms') {
      // 获取当天推荐的 tcm 的 id
      sql = 'SELECT tcm_id as id FROM recommend_tcm WHERE TO_DAYS(create_time) = TO_DAYS(NOW())';
    } else if (query.type === 'articles') {
      // TODO 爬虫
      return [
        {
          title: '孙达出席中医药—尤纳尼传统医药国际研讨会暨中国—巴基斯坦中医药中心揭牌仪式',
          url: 'http://ghs.satcm.gov.cn/gongzuodongtai/2021-06-10/21999.html',
          date: '2021-06-10',
        },
        {
          title: '孙达出席中医药—尤纳尼传统医药国际研讨会暨中国—巴基斯坦中医药中心揭牌仪式',
          url: 'http://ghs.satcm.gov.cn/gongzuodongtai/2021-06-10/21999.html',
          date: '2021-06-10',
        },
        {
          title: '孙达出席中医药—尤纳尼传统医药国际研讨会暨中国—巴基斯坦中医药中心揭牌仪式',
          url: 'http://ghs.satcm.gov.cn/gongzuodongtai/2021-06-10/21999.html',
          date: '2021-06-10',
        },
        {
          title: '孙达出席中医药—尤纳尼传统医药国际研讨会暨中国—巴基斯坦中医药中心揭牌仪式',
          url: 'http://ghs.satcm.gov.cn/gongzuodongtai/2021-06-10/21999.html',
          date: '2021-06-10',
        },
        {
          title: '孙达出席中医药—尤纳尼传统医药国际研讨会暨中国—巴基斯坦中医药中心揭牌仪式',
          url: 'http://ghs.satcm.gov.cn/gongzuodongtai/2021-06-10/21999.html',
          date: '2021-06-10',
        },
      ];
    }
    const result = await this.app.mysql.query(sql);
    return await Promise.all(result.map(async v => {
      return await this.ctx.service.tcms.getTcmSimpleInfo(v.id, [ 'id', 'name', 'actions' ]);
    }));
  }

  async createTcms() {
    if ((await this.index({ type: 'tcms' })).length === 0) {
      const { ctx, app } = this;
      // 获取近 30 天推荐过的 tcm id
      let recommended = await app.mysql.query('SELECT tcm_id as id FROM recommend_tcm where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(create_time)');
      recommended = recommended.map(v => {
        return v.id;
      });
      // 数组去重，对象相同无法去重
      recommended = [ ...new Set(recommended) ];
      // this.ctx.logger.info('30 recommended ids: %o', recommended);
      // 获取药品总数，407
      const totalCount = (await ctx.service.tcms.getTotalCount()) - 1;
      const newRecommends = [];
      while (newRecommends.length < 2) {
        // 可均衡获取 1 到 408 的随机整数
        const num = Math.floor((Math.random() * totalCount) + 1);
        if (recommended.indexOf(num) === -1) {
          newRecommends.push(num);
          recommended.push(num); // 防止这次出现的 id 再次出现
        }
      }
      ctx.logger.info('new recommend tcm ids: %o', newRecommends);
      const now = ctx.service.time.getNowFormatDate();
      for (const id of newRecommends) {
        const result = await app.mysql.insert('recommend_tcm', { tcm_id: id, create_time: now });
        if (result.affectedRows === 1) {
          ctx.logger.info(`insert ${id} id in ${now}`);
        }
      }
    }
  }
}

module.exports = RecommendsService;
