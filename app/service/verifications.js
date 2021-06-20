'use strict';

const { Service } = require('egg');

class VerificationsService extends Service {
  async create(params) {
    const { ctx } = this;
    if (params.type === 'code') {
      if (await ctx.service.users.isExistByPhone(params.phone)) {
        ctx.throw(403, '手机号已注册');
      }
      // TODO 发送短信 api 接入，这个做个测试 demo
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
      }
      const createTime = ctx.service.time.getNowFormatDate();
      try {
        const result = await this.app.mysql.insert('verification_code', {
          phone: params.phone,
          code,
          create_time: createTime,
        });
        if (result.affectedRows !== 0) {
          return code;
        }
      } catch (e) {
        ctx.logger.error(e);
        ctx.throw(500, '获取验证码失败');
      }
    }
  }

  async verify(phone, code) {
    const { ctx } = this;
    try {
      const result = await this.app.mysql.select('verification_code', {
        where: { phone },
        columns: [ 'code' ],
        orders: [[ 'create_time', 'desc' ]],
        limit: 1,
      });
      return result[0].code === code;
    } catch (e) {
      ctx.logger.error(e);
      ctx.throw(500, e.message);
    }
  }
}

module.exports = VerificationsService;
