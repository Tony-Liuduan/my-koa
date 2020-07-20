/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-07-19 21:46:37
 * @LastEditTime 2020-07-20 17:11:42
 */
const http = require('http');
const Stream = require('stream');
const EventEmitter = require('events');
const context = require('./context');
const compose = require('./compose');


module.exports = class Application extends EventEmitter {

    constructor() {
        super();
        this.middleware = [];
        this.context = Object.create(context);
        this.request = {};
        this.response = {};
    }

    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
        this.middleware.push(fn);
        return this;
    }

    listen(...args) {
        const server = http.createServer(this.callback());
        return server.listen(...args);
    }

    callback() {
        // 1. 中间件组合
        // 2. 创建ctx对象
        // 3. 执行请求句柄
        const fn = compose(this.middleware);

        // callback方法只在初始化时执行一次
        // console.log('koa requset callback , --------------------------------s');

        const handleRequest = (req, res) => {
            // 每次请求进来都会执行这个方法，每个请求都会重建创建ctx
            // console.log('handleRequest , +++++++++++++++++++++++++++++++++', req.url);
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        };

        return handleRequest;
    }

    createContext(req, res) {
        const context = Object.create(this.context);
        const request = context.request = Object.create(this.request);
        const response = context.response = Object.create(this.response);

        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;

        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;

        context.originalUrl = request.originalUrl = req.url;
        context.state = {};

        // ctx 内部通过对象原型上getter setter代理request response对象方法属性
        return context;
    }

    handleRequest(ctx, fnMiddleware) {
        const handleResponse = () => respond(ctx);
        const onerror = err => ctx.onerror(err);
        return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    }
}



function respond(ctx) {
    // allow bypassing koa
    // if (false === ctx.respond) return;

    // if (!ctx.writable) return;

    const res = ctx.res;
    let body = ctx.body;
    const code = ctx.status;

    const statuses = {};
    statuses.empty = {
        204: true,
        205: true,
        304: true
    }

    // ignore body
    if (statuses.empty[code]) {
        // strip headers
        ctx.body = null;
        return res.end();
    }

    if ('HEAD' === ctx.method) {
        if (!res.headersSent && !ctx.response.has('Content-Length')) {
            const { length } = ctx.response;
            if (Number.isInteger(length)) ctx.length = length;
        }
        return res.end();
    }

    // status body
    if (null == body) {
        if (ctx.response._explicitNullBody) {
            ctx.response.remove('Content-Type');
            ctx.response.remove('Transfer-Encoding');
            return res.end();
        }
        if (ctx.req.httpVersionMajor >= 2) {
            body = String(code);
        } else {
            body = ctx.message || String(code);
        }
        if (!res.headersSent) {
            ctx.type = 'text';
            ctx.length = Buffer.byteLength(body);
        }
        return res.end(body);
    }


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
}