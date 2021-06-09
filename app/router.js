'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // tcm api
  router.post('/tcm/img', app.jwt, controller.tcm.searchImageUrls);
  // user api
  router.post('/user/login', controller.user.login);
  router.post('/user/reg', controller.user.reg);
};
