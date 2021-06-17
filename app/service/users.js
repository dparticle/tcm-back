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
    // return false;
  }

  // 获取用户基本信息
  async getInfoById(id) {
    const result = await this.app.mysql.select('user', {
      where: { id },
      columns: [ 'username', 'avatar_url', 'phone' ],
    });
    return result[0];
  }

  // 注册
  async create(obj) {
    const { ctx } = this;
    const phone = obj.phone;
    if (await this.isExistByPhone(phone)) {
      ctx.throw(403, '手机号已注册');
    } else {
      const createTime = ctx.service.utils.getNowFormatTime();
      const username = obj.username || phone;
      const avatarUrl = obj.uploader || null;
      const password = obj.password;
      return await this.app.mysql.insert('user', {
        username,
        avatar_url: avatarUrl,
        phone,
        password,
        create_time: createTime,
        update_time: createTime,
      });
    }
  }
}

module.exports = UsersService;
