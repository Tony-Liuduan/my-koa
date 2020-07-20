/**
 * @fileoverview 组合函子
 * @author liuduan
 * @Date 2020-07-20 15:50:22
 * @LastEditTime 2020-07-20 17:12:17
 */
/*
// 调用方式
http.createServer((req, res) => {
    const fnMiddleware = compose(this.middleware); // this.middleware = [middleware1, middleware2, ...]
    const ctx = this.createContext(req, res);

    fnMiddleware(ctx)
        .then(() => {
            const res = ctx.res;
            let body = ctx.body;

            // responses
            if (Buffer.isBuffer(body)) return res.end(body);
            if ('string' === typeof body) return res.end(body);
            if (body instanceof Stream) return body.pipe(res);

            // body: json
            body = JSON.stringify(body);
            if (!res.headersSent) {
                ctx.length = Buffer.byteLength(body);
            }
            res.end(body);
        })
        .catch(e => {
            ctx.onerror(e);
        });
})
*/
module.exports = compose;

function compose(middlewares) {
    return async (ctx) => {
        function createNext(middleware, next) {
            return async () => {
                await middleware(ctx, next);
            }
        }

        let next = async () => await Promise.resolve(); // next 一定是一个函数，保证最后一个中间件，没有next时返回promise

        for (let i = middlewares.length - 1; i >= 0; i--) {
            const middleware = middlewares[i];
            next = createNext(middleware, next);
        }

        await next();
    }
}


function originCompose(middleware) {
    return function (context, next) {
        // last called middleware #
        let index = -1
        return dispatch(0)
        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))

            index = i
            let fn = middleware[i]

            if (i === middleware.length) fn = next

            if (!fn) return Promise.resolve()

            try {
                return Promise.resolve(
                    fn(context, dispatch.bind(null, i + 1))
                );
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}



function mycomponse(middlewares) {
    return function (ctx) {
        function dispatch(i) {
            let fn = middlewares[i];
            if (!fn) return Promise.resolve();
            return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
        }
        return dispatch(0);
    }
}


function mycomponse1(middlewares) {
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


let middlewares = [];

let count = 0;
middlewares.push(async (ctx, next) => {
    console.log(++count, 'start');

    await next();

    console.log('第1个结束');
});

middlewares.push(async (ctx, next) => {
    console.log(++count, 'start');

    await next();

    console.log('第2个结束');
});

middlewares.push(async (ctx, next) => {
    console.log(++count, 'start');

    await next();

    console.log('第3个结束');
});


// mycomponse(middlewares)().then(() => {
//     console.log('mycomponse over');
// })

// originCompose(middlewares)().then(() => {
//     console.log('originCompose over');
// })

// compose(middlewares)().then(() => {
//     console.log('compose over');
// })


// mycomponse1(middlewares)().then(() => {
//     console.log('mycomponse1 over');
// })