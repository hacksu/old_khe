import { createTRPCClient, CreateTRPCClientOptions, createTRPCProxyClient, splitLink } from '@trpc/client';
import { createWSClient, httpLink, wsLink } from '@trpc/react';
import { createProxy } from '@trpc/server/shared';
import type { Router } from '../router';
import { setupTRPC } from '@trpc/next';
import { NextPageContext } from 'next';
import superjson from 'superjson';
import merge from 'lodash/merge';
import get from 'lodash/get';
import getConfig from 'next/config';

const API_URL = getConfig().publicRuntimeConfig['api'];

/** @export 'trpc' */

const APP_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000';

function options(config: {
    ctx?: NextPageContext
}): CreateTRPCClientOptions<Router> {
    const { ctx } = config;
    let url = API_URL || '';
    if (!url.slice(8).includes('/')) {
        url += '/api/trpc';
    }

    return {
        // @ts-ignore
        url,
        transformer: superjson,
        links: [
            getEndingLink(ctx),
        ]
    }
}

function getEndingLink(ctx: NextPageContext | undefined) {
    const http = httpLink({ url: `${APP_URL}/api/trpc` })
    if (typeof window === 'undefined') {
        return http;
    }
    const client = createWSClient({
        url: WS_URL,
    });
    const ws = wsLink<Router>({
        client,
    });
    return splitLink({
        condition(op) {
            if (op.type === 'subscription') {
                return true;
            }
            return false;
        },
        true: ws,
        false: http,
    })
}

const OPTIONS = options({});
const client = createTRPCClient(OPTIONS)
const hooks = setupTRPC<Router>({
    config({ ctx }) {
        return options({ ctx })
    }
})

const proxy = {
    react: hooks.proxy,
    vanilla: createTRPCProxyClient(OPTIONS),
}


export const trpc = merge(client, hooks);

/** TRPC API
 * - Contains React-Query hooks and vanilla TRPC procedure calls
 */
export const api = createProxy(({ args, path }) => {
    const last = [...path].pop();

    const target = last?.startsWith('use')
        ? proxy.react : proxy.vanilla;

    return get(target, path.join('.'))(...args);
}) as typeof proxy.react & typeof proxy.vanilla;

