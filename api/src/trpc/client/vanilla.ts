import { CreateTRPCClientOptions, createTRPCProxyClient } from '@trpc/client';
import { Router } from '../router';
import superjson from 'superjson';


/** @export 'trpc/vanila' */

type ClientContext = {
    host: string
}

function options(config: {
    ctx: ClientContext
}): CreateTRPCClientOptions<Router> {
    const { ctx } = config;
    const url = ctx.host + '/api/trpc';

    return {
        url,
        transformer: superjson,
    }
}

export function vanillaTRPC(ctx: ClientContext) {
    const client = createTRPCProxyClient(options({ ctx }));
    return client;
}
