/**
 * @fileoverview 
 * @author liuduan
 * @Date 2020-07-20 15:29:12
 * @LastEditTime 2020-07-20 15:29:12
 */
module.exports = {

    /**
     * Return request header.
     *
     * @return {Object}
     * @api public
     */

    get header() {
        return this.req.headers;
    },

    /**
     * Set request header.
     *
     * @api public
     */

    set header(val) {
        this.req.headers = val;
    },
}