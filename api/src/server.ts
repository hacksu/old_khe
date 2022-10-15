/** Server
 * - Handles all the requests for this program
 * - Integrates TRPC subscriptions via websockets
 * - Incorporates reverse proxies for development mode
 */

import { session } from './services/authentication/session';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { routeExpressTRPC } from './trpc/helpers/express';
import { isProxied, ReverseProxy } from './utils/proxy';
import { createContext } from './trpc/context';
import { router } from './trpc/router';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { api } from './router';
import express from 'express';
import cors from 'cors';
import './mongo';


const port = 5000;



/** Express app */
export const app = express();
app.use('/api', cors(), session, api, routeExpressTRPC);


/** Node HTTP Server */
export const server = createServer((req, res) => (
    !proxyRequest(req, res) && app(req, res)
));


/** Websocket Server */
export const wss = new WebSocketServer({
    noServer: true,
})


/** Define reverse proxies (like NGINX) */
const proxyRequest = ReverseProxy({ server }, {
    api: {
        enabled: true,
        match(req, { ws }) {
            if (ws) {
                if (!req.url?.startsWith('/_next'))
                    return true; // Matches non-NextJS websockets
            } else {
                if (req.url?.startsWith('/api'))
                    return true; // Matches API routes
            }
        },
    },
    staff: {
        enabled: true,
        server: {
            ws: true,
            target: {
                host: 'localhost',
                port: port + 2,
            },
        },
        match(req) {
            if (req.headers.host?.includes('staff'))
                return true;
        },
    },
    app: {
        enabled: true,
        server: {
            ws: true,
            target: {
                host: 'localhost',
                port: port + 1,
            },
        },
        match(req) {
            return true;
        },
    },
})


/** Apply TRPC Websockets */
const wssHandle = applyWSSHandler({
    wss,
    router,
    createContext,
})

/** Upgrade websockets to WSS for TRPC */
server.on('upgrade', (req, socket, head) => {
    if (!isProxied(req)) {
        /** Handle Session logic */
        session(req, {} as any, () => {});
        wss.handleUpgrade(req, socket, head, ws => {
            wss.emit('connection', ws, req);
        })
    }
});


/** Close connections when the process is about to exit */
process.on('SIGTERM', () => {
    wssHandle.broadcastReconnectNotification();
    server.close();
    wss.close();
});


/** Start the server on the specified port */
server.listen(port);
