'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.v1.home.index);
  // tcm api
  router.post('/tcm/rough', controller.v1.tcms.searchAllRoughInfo);
  router.post('/tcm', app.jwt, controller.v1.tcms.searchCompleteInfoById);
  router.get('/tcm/sum', controller.v1.tcms.getSum);
  router.get('/recommend/tcm', controller.v1.tcms.getRecommendTcm);
  router.get('/recommend/article', controller.v1.tcms.getRecommendArticle);
  // user api
  router.post('/api/v1/login', controller.v1.users.login);
  router.post('/api/v1/users/refreshToken', controller.v1.users.refreshToken);
  router.get('/api/v1/users/me', app.jwt, controller.v1.users.me);
  router.post('/user/reg', controller.v1.users.reg);
};
