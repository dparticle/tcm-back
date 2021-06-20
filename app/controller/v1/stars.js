'use strict';

const Controller = require('egg').Controller;

// TODO 两个 id 如何设计 RESTful
class StarsController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.logger.info('index data: %o', ctx.query);
    ctx.body = await this.service.stars.index(ctx.query);
  }

  async create() {
    const { ctx } = this;
    ctx.logger.info('create data: %o', ctx.request.body);
    // TODO 请求体数据校验，是否存在 tcm_id，使用 egg-validate
    ctx.body = await this.service.stars.create(ctx.request.body);
  }

  async destroy() {
    const { ctx } = this;
    ctx.logger.info('destroy data: %o', ctx.params);
    ctx.body = await this.service.stars.destroy(ctx.params.id);
  }
}

module.exports = StarsController;
