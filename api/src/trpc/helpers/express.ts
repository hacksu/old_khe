import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { transformer } from '../transform';
import { createContext } from '../context';
import camelCase from 'lodash/camelCase';
import { router } from '../router';
import express from 'express';

const handler = express.Router().use((req, res, next) => {
    let { path, query } = req;

    /** Populate TRPC input if this is a normal REST request */
    if (Object.keys(query).length > 0 && !('input' in query)) {
        query.input = transformer.input.stringify(query);
        req.query = query;
    }

    /** Convert slash paths to dot notation
     * - example: `/test/sayHi` => `/test.sayHi`
    */
    if (path.slice(1).includes('/')) {
        path = '/' + path.slice(1).split('/').join('.');
    }

    /** Convert dash paths to camel case
     * - example: `/say-hi` => `/sayHi`
     */
    if (path.includes('-')) {
        path = '/' + path.slice(1).split('.').map(camelCase).join('.');
    }

    /** Update request url */
    if (path !== req.path) {
        req.url = path;
        if (req.url.indexOf('?') > 0) {
            req.url += '?' + req.url.slice(req.url.indexOf('?'))
        }
    }

    next();

}, createExpressMiddleware({
    router,
    createContext,
}))


export const routeExpressTRPC = express.Router()
    .use('/trpc', handler)
    .use(handler)
