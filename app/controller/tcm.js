'use strict';

const Controller = require('egg').Controller;

class TcmController extends Controller {
  async searchImageUrls() {
    const { ctx } = this;
    console.log(ctx.state.user);
    const tcmId = ctx.request.body.tcm_id;
    ctx.body = await this.app.mysql.select('tcm_img', {
      where: { tcm_id: tcmId },
      columns: [ 'tcm_id', 'img_url' ],
    });
  }
}

module.exports = TcmController;
