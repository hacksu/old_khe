import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';


/** TRPC Procedure Context
 * - Passed to all procedures.
 * - Instantiated via {@link createContext}
 */
export type Context = inferAsyncReturnType<typeof createContext>;
export async function createContext(options: CreateHTTPContextOptions | CreateExpressContextOptions | any) {
    return {
        session: options.req?.['session'] as (CreateExpressContextOptions['req']['session'])
    }
}

