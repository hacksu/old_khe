import { initTRPC } from '@trpc/server';
import { transformer } from './transform';
import { Context } from './context';

/** TRPC Procedure Meta
 * Used to define custom route properties
 */
export type Meta = {
    
}

/** TRPC Builder
 * - Used to construct everything TRPC related.
 * - Automatically scoped to Meta, Context, and any other mixins.
 */
export const t = initTRPC<{
    ctx: Context;
    meta: Meta;
}>()({
    transformer,
});

 