import ExpressSession from 'express-session';
import { t } from '../../trpc';
import { PermissibleUser } from './rbac/permissions';


declare module 'express-session' {
    interface SessionData {
        userId?: string;
    }
}

export const session = ExpressSession({
    // TODO: proper secret generation
    secret: 'bruh hi there',
    saveUninitialized: true,
    resave: true,
});

export namespace Session {

    export async function getUser(input: any): Promise<PermissibleUser | null> {
        return null;
    }

    
}

/** Populates `context.user` with the authenticated user, or `null` */
export const withUser = t.middleware(async ({ ctx, next }) => {
    const user = await Session.getUser(ctx);
    return next({
        ctx: {
            ...ctx,
            user,
        }
    })
})