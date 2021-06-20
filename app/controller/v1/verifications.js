'use strict';

const Controller = require('egg').Controller;

class VerificationsController extends Controller {
  async create() {
    const { ctx } = this;
    ctx.logger.info('create data: %o', ctx.request.body);
    ctx.body = await this.service.verifications.create(ctx.request.body);
  }
}

module.exports = VerificationsController;
