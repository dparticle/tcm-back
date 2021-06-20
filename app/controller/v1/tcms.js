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
}

module.exports = TcmsController;
