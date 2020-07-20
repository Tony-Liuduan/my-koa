/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-07-20 16:57:58
 * @LastEditTime 2020-07-20 17:19:14
 */
const MyKoa = require('./lib/application');

const app = new MyKoa();

app.use(async (ctx, next) => {
    console.log('1 start');

    await next();

    console.log('1 end');
    console.log('=============================', ctx.req.url);
})

app.use(async (ctx, next) => {
    console.log('2 start');

    // console.log(next.toString());
    await next();

    console.log('b end');
})

app.use(async (ctx, next) => {
    console.log('3 start');
    
    ctx.status = 200;
    ctx.body = 'hello world!';

    // console.log(next.toString());
    await next();

    console.log('3 end');
})

app.listen(9000);