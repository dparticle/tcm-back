'use strict';

const { Service } = require('egg');

class TcmsService extends Service {
  async index(query) {
    const { ctx } = this;
    let sql,
      options,
      pageSize,
      pageIndex;
    // TODO 现阶段肯定有 type, page, per_page 参数
    if (query.per_page && query.page) {
      // 使用 egg helper 扩展，提供一些实用的 utility 函数
      pageSize = ctx.helper.parseInt(query.per_page);
      pageIndex = ctx.helper.parseInt(query.page);
    }
    if (query.type === 'all') {
      sql = `SELECT id FROM tcm_info ${query.keyword ? ` WHERE name LIKE CONCAT('%', '${query.keyword}', '%') ` : ''} LIMIT ? OFFSET ?`;
      options = [ pageSize, pageIndex * pageSize ];
    } else {
      sql = `SELECT id FROM tcm_info WHERE ${query.type} LIKE CONCAT('%', '${query.type_value}', '%') ${query.keyword ? ` AND name LIKE CONCAT('%', '${query.keyword}', '%') ` : ''} LIMIT ? OFFSET ?`;
      options = [ pageSize, pageIndex * pageSize ];
    }
    const result = await this.app.mysql.query(sql, options);
    // async 函数执行完会返回 Promise 对象
    return await Promise.all(result.map(async v => {
      return await this.getTcmSimpleInfo(v.id, [ 'id', 'name', 'name_eng' ]);
    }));
  }

  async show(id) {
    return await this.getTcmInfo(id);
  }

  // 获取药品总数
  async getTotalCount() {
    this.ctx.logger.info('get total count');
    const result = await this.app.mysql.query('SELECT COUNT(*) AS total_count FROM tcm_info');
    return result[0];
  }

  // 获取某个 tcm 指定字段信息
  async getTcmInfo(id) {
    this.ctx.logger.info('get ' + id + ' id\'s info');
    const result = await this.app.mysql.select('tcm_info', {
      where: { id },
      columns: [ '*' ],
    });
    // 返回一个数据，所以直接返回第一个元素
    result[0].imgs = await this.getImageUrls(id);
    return result[0];
  }

  // 获取某个 tcm 指定字段信息
  async getTcmSimpleInfo(id, columns) {
    this.ctx.logger.info('get ' + id + ' id\'s simple info');
    const result = await this.app.mysql.select('tcm_info', {
      where: { id },
      columns,
    });
    result[0].img = (await this.getImageUrls(id))[0];
    return result[0];
  }

  // 通过 id 获取图片资源 URL
  async getImageUrls(id) {
    this.ctx.logger.info('get ' + id + ' id\'s image urls');
    const result = await this.app.mysql.select('tcm_img', {
      where: { tcm_id: id },
      columns: [ 'img_url' ],
    });
    const imgList = [];
    result.forEach(v => {
      imgList.push(v.img_url);
    });
    return imgList;
  }
}

module.exports = TcmsService;
