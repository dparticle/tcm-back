'use strict';

const { Service } = require('egg');

class StarsService extends Service {
  async index(query) {
    const { ctx, app } = this;
    const user_id = await ctx.service.token.getId();
    // 查询是否收藏
    if (query.tcm_id) {
      const sql = 'SELECT * FROM star WHERE tcm_id = ? AND user_id = ?';
      const result = await app.mysql.query(sql, [ query.tcm_id, user_id ]);
      return result.length !== 0;
    }
    // 获取收藏列表
    const result = await app.mysql.select('star', {
      where: { user_id },
      columns: [ 'tcm_id' ],
      orders: [[ 'create_time', 'desc' ]],
    });
    return await Promise.all(result.map(async v => {
      return await this.ctx.service.tcms.getTcmSimpleInfo(v.tcm_id, [ 'id', 'name' ]);
    }));
  }

  async create(params) {
    const { ctx } = this;
    const user_id = await ctx.service.token.getId();
    const createTime = ctx.service.time.getNowFormatDate();
    try {
      const result = await this.app.mysql.insert('star', {
        tcm_id: params.tcm_id,
        user_id,
        create_time: createTime,
      });
      if (result.affectedRows !== 0) {
        return '收藏成功';
      }
    } catch (e) {
      ctx.logger.error(e);
      ctx.throw(500, '收藏失败');
    }
  }

  async destroy(id) {
    const { ctx } = this;
    const user_id = await ctx.service.token.getId();
    try {
      const result = await this.app.mysql.delete('star', {
        tcm_id: id,
        user_id,
      });
      if (result.affectedRows !== 0) {
        return '取消收藏';
      }
    } catch (e) {
      ctx.logger.info(e);
      ctx.throw(500, '取消收藏失败');
    }
  }
}

module.exports = StarsService;
