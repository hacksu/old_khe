import { t } from '.';
import { observable } from '@trpc/server/observable';
import { randomUUID } from 'crypto';
import { Authentication } from '../services/authentication';
import { transformer } from './transform';
import camelCase from 'lodash/camelCase';
import express from 'express';


/** @export 'trpc/router' */

/** Router type used in client imports */
export type Router = typeof router;

/** Import model routers */
const models = t.router({

})

/** Import service routers */
const services = t.router({
    auth: Authentication.router,
})

/** Define one-off routes here */
const routes = t.router({
    ping: t.procedure.query(({ ctx }) => {
        console.log('got pinged');
        const newId = randomUUID();
        // console.log('bruh', [ctx.session.bruh, newId]);
        // ctx.session.bruh = newId;
        ctx.session.save();
        return new Date();
    }),
    onDate: t.procedure.subscription(() => {
        return observable<{ date: Date }>(emit => {
            const onDate = () => {
                emit.next({ date: new Date() })
                // emit.next({ date: new Date(new Date().getTime() - 50000) })
            }

            onDate();
            const intv = setInterval(() => {
                onDate()
            }, 1000);

            return () => clearInterval(intv);
        })
    })
})

/** Merge in any routers where other routes are defined */
export const router = t.mergeRouters(
    routes,
    models,
    services
)


