# my-koa


### mykoa-demo启动
```sh
npm start
# goto http://localhost:9000/
```


### compose 实现demo
> 详见 /lib/compose.js

```js
// koa-compose 组合函子
// 实现方式1 -- 类似koa-compose源代码
function mycomponse1(middlewares) {
    return function (ctx) {
        function dispatch(i) {
            // 这里省去了next不能在中间件中重复调用检查
            let fn = middlewares[i];
            if (!fn) return Promise.resolve();
            return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
        }
        return dispatch(0);
    }
}

// 实现方式2 -- for循环写法
function mycomponse2(middlewares) {
    return function (ctx) {
        let next = () => Promise.resolve();

        next = middlewares.reduceRight((next, middleware) => {
            return async () => {
                await middleware(ctx, next);
            }
        }, next);

        return next();
    }
}
```