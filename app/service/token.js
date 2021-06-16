'use strict';

const moment = require('moment');
const { Service } = require('egg');

class TokenService extends Service {
  // 生成密钥
  async createToken(msg) {
    const { app } = this;
    return app.jwt.sign(msg, app.config.jwt.secret, { expiresIn: '1 days' });
  }

  // 解析 token
  async parseToken(token) {
    const { ctx } = this;
    const info = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64')
        .toString()
    );
    ctx.logger.info('token info: %o', info);
    return info;
  }

  // 获取 token 手机号
  async getPhone(token) {
    const { ctx } = this;
    const phone = (await this.parseToken(token)).phone;
    ctx.logger.info('解析 token 获取手机号 => ' + phone);
    return phone;
  }

  // 获取 token 有效期
  async getExpires(token) {
    const { ctx } = this;
    // egg-jwt 的时间只记录到秒，所以它保存的是 10 位时间戳
    // Date().getTime() 获取的是 13 位时间戳，做计算需要乘以 1000
    const exp = (await this.parseToken(token)).exp * 1000;
    ctx.logger.info('解析 token 获取有效期 => ' + await this.formatDate(exp));
    return Number(exp);
  }

  // 格式化时间，毫秒数格式化
  async formatDate(milliseconds) {
    return moment(new Date().setTime(milliseconds))
      .format('YYYY-MM-DD HH:mm:ss');
  }

  // 判断 token 是否即将过期或过期不久，后台防止那些不通过前端客户端请求的工具（安全）
  async isTokenExpired(token) {
    // 注意月份减 1
    // let curTime = new Date(2021, 5, 14, 1, 11, 0).getTime();
    const curTime = new Date().getTime();
    const expiresTime = await this.getExpires(token);
    // 过期前后 20 分钟
    return Math.abs(curTime - expiresTime) <= 1200000;
  }
}

module.exports = TokenService;
