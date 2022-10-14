import { z } from 'zod';
import { t } from '../../trpc';
import { withUser } from './session';
import { AuthenticationEvents } from '.';
import './rbac/config';


export * from './events';

export namespace Authentication {
    export const events = AuthenticationEvents;
    export const subscribe = events.subscribe;

    export const router = t.router({

        login: t.procedure
            .input(z.object({
                password: z.string()
            }))
            .mutation(({ ctx, input }) => {
                const { password } = input;
                // TODO: pull user and verify password
            }),

        me: t.procedure
            .use(withUser)
            .query(({ ctx }) => {
                if (ctx.user) {
                    // TODO: return the user itself
                    return ctx.user;
                }
                return null;
            }),

    })

}

