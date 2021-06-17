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
      return await this.getTcmSimpleInfo(v.id, [ 'id', 'name', 'actions' ]);
    }));
  }
}

module.exports = RecommendsService;
