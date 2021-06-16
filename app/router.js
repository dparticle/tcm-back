'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // tcm api
  router.post('/tcm/rough', controller.tcm.searchAllRoughInfo);
  router.post('/tcm', app.jwt, controller.tcm.searchCompleteInfoById);
  router.get('/tcm/sum', controller.tcm.getSum);
  router.get('/recommend/tcm', controller.tcm.getRecommendTcm);
  router.get('/recommend/article', controller.tcm.getRecommendArticle);
  // user api
  router.post('/login', controller.users.login);
  router.post('/user/reg', controller.users.reg);
  router.get('/user/me', app.jwt, controller.users.me);
  router.post('/users/refreshToken', controller.users.refreshToken);
};
