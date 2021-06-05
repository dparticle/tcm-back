'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {
  async searchImageUrls() {
    const { ctx } = this;
    const tcmId = ctx.request.body.tcm_id;
    ctx.body = await this.app.mysql.select('tcm_img', {
      where: { tcm_id: tcmId },
      columns: [ 'tcm_id', 'img_url' ],
    });
  }
}

module.exports = SearchController;
