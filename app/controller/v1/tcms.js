'use strict';

const Controller = require('egg').Controller;

class TcmsController extends Controller {
  // query 和 params 获取到的都是字符串
  async index() {
    const { ctx } = this;
    ctx.logger.info('index data: %o', ctx.query);
    ctx.body = await this.service.tcms.index(ctx.query);
  }

  async show() {
    const { ctx } = this;
    ctx.logger.info('show data: %o', ctx.params);
    ctx.body = await this.service.tcms.show(ctx.params.id);
  }

  async getRecommendTcm() {
    console.log('GET /recommend/tcm');
    const { ctx } = this;
    // 获取当天推荐的 tcm 的 id
    const recommendIdList = await this.app.mysql.query('SELECT tcm_id FROM recommend_tcm WHERE TO_DAYS(create_time) = TO_DAYS(NOW())');
    const result = [];
    for (const item of recommendIdList) {
      result.push(await this.getInfoById(item.tcm_id, [ 'id', 'name', 'actions' ]));
    }
    ctx.body = result;
  }

  async getRecommendArticle() {
    console.log('GET /recommend/article');
    const { ctx } = this;
    ctx.body = [
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
}

module.exports = TcmsController;
