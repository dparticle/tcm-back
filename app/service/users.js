'use strict';

const { Service } = require('egg');

class UsersService extends Service {
  // 判断用户是否为存在
  async isExist(phone) {
    const result = await this.app.mysql.select('user', {
      where: { phone },
      columns: [ 'id', 'phone', 'remove_time' ],
    });
    return !(result.length === 0 || result[0].remove_time !== null);
  }

  // 登录
  async login(phone, password) {
    const { app } = this;
    const result = await app.mysql.select('user', {
      where: { phone, password },
      columns: [ 'id' ],
    });
    if (result.length !== 0) {
      return true;
    }
    const errorMsg = await this.isExist(phone) ? '密码错误' : '用户不存在';
    this.ctx.throw(403, errorMsg);
    return false;


    // return result.length !== 0;
  }
}

module.exports = UsersService;
