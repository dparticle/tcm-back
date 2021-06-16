'use strict';

const Controller = require('egg').Controller;

class TcmController extends Controller {
  async getImageUrls(id) {
    console.log('search image urls by ' + id + ' id');
    const result = await this.app.mysql.select('tcm_img', {
      where: { tcm_id: id },
      columns: [ 'img_url' ],
    });
    const imgList = [];
    result.forEach(v => {
      imgList.push(v.img_url);
    });
    return imgList;
  }

  async getInfoById(id, columns) {
    console.log('search info by ' + id + ' id');
    const result = await this.app.mysql.select('tcm_info', {
      where: { id },
      columns,
    });
    // 返回一个数据，所以直接返回第一个元素
    result[0].imgs = await this.getImageUrls(id);
    return result[0];
  }

  async searchAllRoughInfo() {
    console.log('POST /tcm/rough');
    const { ctx } = this;
    console.log(ctx.request.body);
    const page = ctx.request.body.page;
    const perPage = ctx.request.body.perPage;
    const result = await this.app.mysql.select('tcm_info', {
      columns: [ 'id', 'name', 'name_eng' ],
      limit: perPage,
      offset: page * perPage,
    });
    // 遍历所有结果，添加图片属性
    for (const r of result) {
      const imgList = await this.getImageUrls(r.id);
      if (imgList.length !== 0) {
        // 默认添加第一张图片
        r.img = imgList[0];
      }
    }
    ctx.body = result;
  }

  async searchCompleteInfoById() {
    console.log('POST /tcm');
    const { ctx } = this;
    console.log(ctx.state.user);
    console.log(ctx.request.body);
    const id = ctx.request.body.id;
    // TODO 每次点击的都是存在的 id，还是否需要做错误处理
    ctx.body = await this.getInfoById(id, [ '*' ]);
  }

  async getSum() {
    console.log('GET /tcm/sum');
    const { ctx } = this;
    const result = await this.app.mysql.query('SELECT COUNT(*) AS sum FROM tcm_info');
    console.log(result);
    ctx.body = result[0];
  }

  async getRecommendTcm() {
    console.log('GET /recommend/tcm');
    const { ctx } = this;
    // 获取当天推荐的 tcm 的 id
    const recommendIdList = await this.app.mysql.query('SELECT tcm_id FROM recommend WHERE TO_DAYS(create_time) = TO_DAYS(NOW())');
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

module.exports = TcmController;
