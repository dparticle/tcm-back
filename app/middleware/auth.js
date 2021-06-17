'use strict';

module.exports = (options, app) => {
  return async function(ctx, next) {
    // 拿到不需要验证的 token 的路由
    const routerAuth = app.config.jwt.allowed;
    // 获取当前路由
    const url = ctx.url;
    // 判断当前路由是否需要验证 token
    let flag = false;
    for (const router of routerAuth) {
      const re = new RegExp(router);
      if (re.test(url)) {
        ctx.logger.info(re);
        flag = true;
        break;
      }
    }
    if (flag) {
      ctx.logger.info(url + ' 不需要验证 token');
      await next();
    } else {
      ctx.logger.info(url + ' 验证 token');
      // 获取 token，截掉 Bearer
      const token = ctx.headers.authorization ? ctx.headers.authorization.slice(7) : '';

      // 解析 token
      try {
        ctx.state.user = await app.jwt.verify(token, app.config.jwt.secret);
        await next();
      } catch (err) {
        ctx.logger.error('token 鉴权失败');
        ctx.throw(401, 'token 鉴权失败');
      }

    }

  };
};
