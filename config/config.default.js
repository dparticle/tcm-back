/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1622878569168_9281';

  // add your middleware config here
  // 中间件执行顺序则是按照数组中的顺序执行
  config.middleware = [ 'auth' ];

  // egg-mysql config
  config.mysql = {
    // database configuration
    client: {
      // host
      host: '***REMOVED***',
      // port
      port: '3306',
      // username
      user: '***REMOVED***',
      // password
      password: '***REMOVED***',
      // database
      database: '***REMOVED***',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.jwt = {
    secret: 'dparticle',
    // 不需要验证 token 的路由
    allowed: [
      '/api/v1/login',
      '/api/v1/users/refreshToken',
      // TODO 完全匹配，得用 / 匹配
      '^/api/v1/users$',
      '^/api/v1/verifications$',
      // TODO 特定情况匹配，太蠢了，正则表达式没学好呜呜呜
      '^/api/v1/tcms\\?',
      '^/api/v1/recommends\\?',
    ],
  };

  // csrf 关闭
  config.security = {
    csrf: false,
    // 白名单，不加也可以实现跨域访问
    domainWhiteList: [ '*' ],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // 配置打印日志的级别
  config.logger = {
    // 文件
    // level: 'DEBUG',
    // 终端
    consoleLevel: 'DEBUG',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
