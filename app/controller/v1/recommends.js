'use strict';

const Controller = require('egg').Controller;

class RecommendsController extends Controller {
  // query 和 params 获取到的都是字符串
  async index() {
    const { ctx } = this;
    ctx.logger.info('index data: %o', ctx.query);
    ctx.body = await this.service.recommends.index(ctx.query);
  }
}

module.exports = RecommendsController;
