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
    const { ctx } = this;
    // console.log(ctx.request.body);
    const phone = ctx.request.body.phone;
    const password = ctx.request.body.password;
    const result = await this.app.mysql.select('user', {
      where: { phone, password },
      columns: [ 'id' ],
    });
    if (result.length === 0) {
      ctx.body = {
        state: false,
        message: await this.isNewUser(phone) ? '用户不存在' : '密码错误',
      };
    } else {
      ctx.body = {
        state: true,
        message: '登录成功',
      };
    }
  }

  async reg() {
    const { ctx } = this;
    const phone = ctx.request.body.phone;
    if (await this.isNewUser(phone)) {
      const createTime = moment(new Date())
        .format('YYYY-MM-DD HH:mm:ss');
      const username = ctx.request.body.username === null ? phone : ctx.request.body.username;
      const avatar_url = ctx.request.body.uploader === null ? null : ctx.request.body.uploader[0].url;
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
}

module.exports = UserController;
