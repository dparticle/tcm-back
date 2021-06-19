'use strict';

const { Service } = require('egg');
const cheerio = require('cheerio');

class RecommendsService extends Service {
  async index(query) {
    // 如果在 8 点之前访问，返回前一天的
    const hour = new Date().getHours();
    let sqlDate;
    if (hour < 8) {
      sqlDate = ' TO_DAYS(NOW()) - TO_DAYS(create_time) <= 1';
    } else {
      sqlDate = ' TO_DAYS(create_time) = TO_DAYS(NOW())';
    }
    let sql;
    if (query.type === 'tcms') {
      // 获取当天推荐的 tcm 的 id
      sql = 'SELECT tcm_id as id FROM recommend_tcm WHERE ' + sqlDate;
    } else if (query.type === 'articles') {
      sql = 'SELECT title, url, date FROM recommend_article WHERE ' + sqlDate;
    }
    const result = await this.app.mysql.query(sql);
    if (query.type === 'tcms') {
      return await Promise.all(result.map(async v => {
        return await this.ctx.service.tcms.getTcmSimpleInfo(v.id, [ 'id', 'name', 'actions' ]);
      }));
    }
    return result;
  }

  // 判断今日是否已存在推荐
  async isExistToday(type) {
    let sql;
    if (type === 'tcms') {
      sql = 'SELECT id FROM recommend_tcm WHERE TO_DAYS(create_time) = TO_DAYS(NOW())';
    } else if (type === 'articles') {
      sql = 'SELECT id FROM recommend_article WHERE TO_DAYS(create_time) = TO_DAYS(NOW())';
    }
    const result = await this.app.mysql.query(sql);
    if (result.length === 0) {
      return false;
    }
    return true;
  }

  async createTcms() {
    const { ctx } = this;
    if (!(await this.isExistToday('tcms'))) {
      const { app } = this;
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
    } else {
      ctx.logger.info('recommended today tcm ids already exists');
    }
  }

  // 爬取国家中医药管理局时政要闻栏列表
  async fetchArticles() {
    const { ctx } = this;
    if (!(await this.isExistToday('articles'))) {
      const url = 'http://www.satcm.gov.cn';
      const result = await ctx.curl(url, {
        method: 'GET',
      });
      const $ = cheerio.load(result.data);
      const lis = $('#JKDiv_1 li');
      const articles = [];
      for (let i = 0; i < lis.length; i++) {
        const li = lis.eq(i);
        const article = {
          title: li.find('a')
            .text()
            .trim(),
          url: url + li.find('a')
            .attr('href')
            .trim(),
          date: li.find('font')
            .text()
            .trim(),
        };
        // ctx.logger.info(article);
        articles.push(article);
      }
      // 插入数据库
      const now = ctx.service.time.getNowFormatDate();
      for (const article of articles) {
        const result = await this.app.mysql.insert('recommend_article', {
          title: article.title,
          url: article.url,
          date: article.date,
          create_time: now,
        });
        if (result.affectedRows === 1) {
          ctx.logger.info(`insert ${article.title} in ${now}`);
        }
      }
    } else {
      ctx.logger.info('recommended today articles already exists');
    }
  }

}

module.exports = RecommendsService;
