'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // tcms api
  // GET 查询/POST 创建 tcms
  router.resources('tcms', '/api/v1/tcms', controller.v1.tcms);
  // GET 获取 tcm
  router.resources('tcm', '/api/v1/tcms/:id', controller.v1.tcms);
  // recommends api
  router.resources('recommends', '/api/v1/recommends', controller.v1.recommends);
  // users api
  router.post('/api/v1/login', controller.v1.users.login);
  router.post('/api/v1/users/refreshToken', controller.v1.users.refreshToken);
  // GET 查询/POST 创建 users
  router.resources('users', '/api/v1/users', controller.v1.users);
  // 更新用户名
  router.resources('user', '/api/v1/users/:id', controller.v1.users);
  // TODO 更新 user
  router.get('/api/v1/users/me', controller.v1.users.me);
};
