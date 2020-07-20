/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-07-20 14:47:05
 * @LastEditTime 2020-07-20 15:49:21
 */
'use strict';

/**
 * Module dependencies.
 */

// const util = require('util');
// const createError = require('http-errors');
// const httpAssert = require('http-assert');
// const delegate = require('delegates');
// const statuses = require('statuses');
// const Cookies = require('cookies');

const COOKIES = Symbol('context#cookies');

/**
 * Context prototype.
 */

module.exports = {
    get cookies() {
        // if (!this[COOKIES]) {
        //     this[COOKIES] = new Cookies(this.req, this.res, {
        //         keys: this.app.keys,
        //         secure: this.request.secure
        //     });
        // }
        return this[COOKIES];
    },

    set cookies(_cookies) {
        this[COOKIES] = _cookies;
    }
};

/**
 * Custom inspection implementation for newer Node.js versions.
 *
 * @return {Object}
 * @api public
 */

/* istanbul ignore else */
// if (util.inspect.custom) {
//     module.exports[util.inspect.custom] = module.exports.inspect;
// }

/**
 * Response delegation.
 */
// 代理设置
// delegate(proto, 'response')
//     .method('attachment')
//     .method('redirect')
//     .method('remove')
//     .method('vary')
//     .method('has')
//     .method('set')
//     .method('append')
//     .method('flushHeaders')
//     .access('status')
//     .access('message')
//     .access('body')
//     .access('length')
//     .access('type')
//     .access('lastModified')
//     .access('etag')
//     .getter('headerSent')
//     .getter('writable');

/**
 * Request delegation.
 */

// delegate(proto, 'request')
//     .method('acceptsLanguages')
//     .method('acceptsEncodings')
//     .method('acceptsCharsets')
//     .method('accepts')
//     .method('get')
//     .method('is')
//     .access('querystring')
//     .access('idempotent')
//     .access('socket')
//     .access('search')
//     .access('method')
//     .access('query')
//     .access('path')
//     .access('url')
//     .access('accept')
//     .getter('origin')
//     .getter('href')
//     .getter('subdomains')
//     .getter('protocol')
//     .getter('host')
//     .getter('hostname')
//     .getter('URL')
//     .getter('header')
//     .getter('headers')
//     .getter('secure')
//     .getter('stale')
//     .getter('fresh')
//     .getter('ips')
//     .getter('ip');