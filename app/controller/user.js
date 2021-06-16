'use strict';

const moment = require('moment');
const Controller = require('egg').Controller;

class UserController extends Controller {

  async login() {
    const { ctx, service } = this;
    ctx.logger.info('login data: %o', ctx.request.body);
    const phone = ctx.request.body.phone;
    const password = ctx.request.body.password;
    if (await service.user.login(phone, password)) {
      // ctx.body = app.jwt.sign({ phone }, app.config.jwt.secret, { expiresIn: '1 days' });
      ctx.body = await service.token.createToken({ phone });
    } else {
      ctx.body = await service.user.isExist(phone) ? '密码错误' : '用户不存在';
    }
  }

  async reg() {
    // log
    console.log('POST /user/reg');
    const { ctx } = this;
    console.log(ctx.request.body);
    const phone = ctx.request.body.phone;
    if (await this.isNewUser(phone)) {
      const createTime = moment(new Date())
        .format('YYYY-MM-DD HH:mm:ss');
      // 如果 username 是空，与手机号相同
      const username = ctx.request.body.username === undefined ? phone : ctx.request.body.username;
      const avatar_url = ctx.request.body.uploader === undefined ? null : ctx.request.body.uploader[0].url;
      const password = ctx.request.body.password;
      ctx.body = await this.app.mysql.insert('user', {
        username,
        avatar_url,
        phone,
        password,
        create_time: createTime,
        update_time: createTime,
      });
    } else {
      ctx.body = { error: '手机号已注册' };
    }
  }

  async me() {
    // log
    console.log('GET /user/me');
    const { ctx } = this;
    console.log(ctx.state.user);
    const phone = ctx.state.user.phone;
    const result = await this.app.mysql.select('user', {
      where: { phone },
      columns: [ 'username', 'avatar_url', 'phone' ],
    });
    ctx.body = result[0];
  }

  async refreshToken() {
    const { ctx, service } = this;
    // %j vs %o，在这只是打印样式不同
    ctx.logger.info('refresh token data: %o', ctx.request.body);
    const token = ctx.request.body.token;
    // ctx.body = app.jwt.sign({ phone: ctx.request.body.phone }, app.config.jwt.secret, { expiresIn: '1 days' });
    if (await service.token.isTokenExpired(token)) {
      ctx.logger.info('token 即将过期或过期不久，更新 token');
      ctx.body = await service.token.createToken({ phone: await service.token.getPhone(token) });
    } else {
      ctx.logger.info('token 过期，无法更新 token');
      ctx.status = 403;
      ctx.body = 'token expired';
    }
  }
}

module.exports = UserController;
