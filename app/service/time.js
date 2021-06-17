'use strict';

const moment = require('moment');
const { Service } = require('egg');

class TimeService extends Service {
  getNowFormatDate() {
    return moment(Date.now())
      .format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = TimeService;
