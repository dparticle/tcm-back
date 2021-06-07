'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    console.log(ctx.request.body);
    const username = ctx.request.body.username;
    const pwd = ctx.request.body.password;
    const result = await this.app.mysql.select('user', {
      where: { phone: username, password: pwd },
      columns: [ 'id' ],
    });
    if (result.length === 0) {
      ctx.body = false;
    } else {
      ctx.body = true;
    }
  }
}

module.exports = UserController;
