import { hasPermission, Permissions } from './permissions';
import { TRPCError } from '@trpc/server';
import { Session } from '../session';
import { t } from '../../../trpc';
import { merge } from 'lodash';



export function access<T extends Permissions>(permission: T) {
    return t.middleware(async ({ ctx, next }) => {
        const user = await Session.getUser(ctx);
        if (user && user !== null) {
            if (hasPermission(user, permission)) {
                return next({
                    ctx: {
                        ...ctx,
                        user,
                    }
                })
            }
        }
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    })
}


export const tr = merge(t, {
    access<T extends Permissions>(permission: T) {
        return t.procedure.use(access(permission));
    }
});


// const router = t.router({
//     bruh: tr.access({ }).query(() => {
//         return 'hi'
//     })
// })