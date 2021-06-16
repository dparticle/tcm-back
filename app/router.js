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
  router.get('/tcm/recommend', controller.tcm.getDailyRecommend);
  // user api
  router.post('/user/login', controller.user.login);
  router.post('/user/reg', controller.user.reg);
  router.get('/user/me', app.jwt, controller.user.me);
  router.post('/user/refreshToken', controller.user.refreshToken);
};
