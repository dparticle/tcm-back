'use strict';

const { Service } = require('egg');

class UsersService extends Service {
  // 获取用户 id
  async getUserId(obj) {
    const result = await this.app.mysql.select('user', {
      where: obj,
      columns: [ 'id' ],
    });
    return result[0].id;
  }

  // 获取用户的手机号
  async getUserPhoneById(id) {
    const result = await this.app.mysql.select('user', {
      where: { id },
      columns: [ 'phone' ],
    });
    return result[0].phone;
  }

  // 判断用户是否为存在
  async isExistByPhone(phone) {
    const result = await this.app.mysql.select('user', {
      where: { phone },
      columns: [ 'id', 'phone', 'remove_time' ],
    });
    return !(result.length === 0 || result[0].remove_time !== null);
  }

  // 登录
  async login(phone, password) {
    const result = await this.app.mysql.select('user', {
      where: { phone, password },
      columns: [ 'id' ],
    });
    if (result.length !== 0) {
      return true;
    }
    const errorMsg = await this.isExistByPhone(phone) ? '密码错误' : '用户不存在';
    this.ctx.throw(403, errorMsg);
    return false;
  }

  // 获取用户基本信息
  async getInfoById(id) {
    const result = await this.app.mysql.select('user', {
      where: { id },
      columns: [ 'username', 'avatar_url', 'phone' ],
    });
    return result[0];
  }
}

module.exports = UsersService;
