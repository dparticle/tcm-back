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
  config.middleware = [];

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

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
