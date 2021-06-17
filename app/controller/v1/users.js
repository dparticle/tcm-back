'use strict';

const moment = require('moment');
const Controller = require('egg').Controller;

class UsersController extends Controller {

  async login() {
    const { ctx, service } = this;
    ctx.logger.info('login data: %o', ctx.request.body);
    const phone = ctx.request.body.phone;
    const password = ctx.request.body.password;
    // 登录，如果登录失败直接抛出错误不会执行创建 token
    await service.users.login(phone, password);
    ctx.body = service.token.createToken({ id: await service.users.getUserId({ phone }) });
  }

  async reg() {
    const { ctx } = this;
    ctx.logger.info('reg data: %o', ctx.request.body);
    ctx.body = await this.service.users.register(ctx.request.body);
  }

  async me() {
    const { ctx } = this;
    ctx.logger.info('token info: %o', ctx.state.user);
    const id = ctx.state.user.id;
    ctx.body = await this.service.users.getInfoById(id);
  }

  refreshToken() {
    const { ctx, service } = this;
    // %j vs %o，在这只是打印样式不同
    ctx.logger.info('refresh token data: %o', ctx.request.body);
    const token = ctx.request.body.token;
    if (service.token.isTokenExpired(token)) {
      ctx.logger.info('token 即将过期或过期不久，更新 token');
      ctx.body = service.token.createToken({ id: service.token.getId(token) });
    } else {
      // 后端测试的时候可能时间离过期还有很久，判断是用绝对值的，所以也提醒 token 过期了，真正使用中会先在客户端判断
      ctx.logger.info('token 过期，无法更新 token');
      ctx.status = 403;
      ctx.body = 'token expired';
    }
  }
}

module.exports = UsersController;
