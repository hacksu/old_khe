import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext } from './trpc/context';
import { transformer } from './trpc/transform';
import camelCase from 'lodash/camelCase';
import { router } from './trpc/router';
import express, { RequestHandler } from 'express';
import { routeExpressTRPC } from './trpc/helpers/express';
export const api = express();

const rewrites = {
    '/me': '/auth.me',
    '/login': '/auth.login',
    '/logout': '/auth.logout',
}

const rewrite: (to: string) => RequestHandler = (to) => (req, res, next) => { req.url = to; next() }
for (const key in rewrites) api.all(key, rewrite(rewrites[key]));



api.get('/', (req, res) => {
    res.send('hi')
});


// api.use(routeExpressTRPC);