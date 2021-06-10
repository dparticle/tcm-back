'use strict';

const moment = require('moment');
const Controller = require('egg').Controller;

class UserController extends Controller {
  async isNewUser(phone) {
    const result = await this.app.mysql.select('user', {
      where: { phone },
      columns: [ 'id', 'phone', 'remove_time' ],
    });
    return result.length === 0 || result[0].remove_time !== null;
  }

  async login() {
    // log
    console.log('POST /user/login');
    const { ctx, app } = this;
    console.log(ctx.request.body);
    const phone = ctx.request.body.phone;
    const password = ctx.request.body.password;
    const result = await this.app.mysql.select('user', {
      where: { phone, password },
      columns: [ 'id' ],
    });
    if (result.length === 0) {
      ctx.body = {
        error: await this.isNewUser(phone) ? '用户不存在' : '密码错误',
      };
    } else {
      ctx.body = app.jwt.sign({ phone }, app.config.jwt.secret, { expiresIn: '1 days' });
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
}

module.exports = UserController;
