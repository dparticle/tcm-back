'use strict';

const moment = require('moment');
const { Service } = require('egg');

class UtilsService extends Service {
  getNowFormatTime() {
    return moment(Date.now())
      .format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = UtilsService;
