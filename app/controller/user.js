'use strict';

const moment = require('moment');
const Controller = require('egg').Controller;

class UserController extends Controller {
  async isNewUser(phone) {
    const result = await this.app.mysql.select('user', {
      where: { phone },
      columns: [ 'id', 'phone' ],
    });
    return result.length === 0;
  }

  async login() {
    const { ctx } = this;
    console.log(ctx.request.body);
    const username = ctx.request.body.username;
    const pwd = ctx.request.body.password;
    const result = await this.app.mysql.select('user', {
      where: { phone: username, password: pwd },
      columns: [ 'id' ],
    });
    ctx.body = result.length !== 0;
  }

  async register() {
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
      ctx.body = '此手机号已注册';
    }

  }
}

module.exports = UserController;
