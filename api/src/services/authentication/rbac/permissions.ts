/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import { DeepPartial, LiteralUnion, DeepMap, Merge } from 'react-hook-form';
import { UserData } from '../../../models/user';
import { merge, get } from 'lodash';
import { RegistrationStatus } from '../../../models/registration';
import { TicketPermissions } from '../../../controllers/tickets/model';
import { DISABLE_PERMISSIONS } from './config';


// TODO: replace with import
namespace UserPermissions {
    export const Read = { users: { read: true } } as const;
    export const UpdateRole = { users: { updateRole: true } } as const;
}


/** Define permission imports */
export namespace Permission {
    const all = AddPermissionsAll;

    // Export the imported permissions
    export const Tickets = all(TicketPermissions);
    export const Users = all(UserPermissions);

    
}


const PermissionDerivations: ((input: PermissibleUser) => Permissions)[] = [];

/** Compute permissions from what is available
 * - This is how permissions are derived from a user's attributes (role, status, etc)
*/
export function derivePermissions(user: PermissibleUser): Permissions {
    // const role = RolePermissions[user.role];
    // const status = RegistrationStatusPermissions[user?.application?.status];
    // return merge({}, role, status, user.permissions || {});
    const derivations = PermissionDerivations.map(o => o(user));
    return merge({}, ...[...derivations, user.permissions || {}]);
}

function AddPermissionsAll<T extends Record<string, { [key: string]: any }>>(perms: T): T & {
    All: Intersect<T[keyof T]>
} {
    const all: any = {};
    for (const key in perms) {
        const value = perms[key];
        merge(all, value);
    }
    // @ts-ignore
    perms['All'] = all;
    return perms as any;
}

// ---- internals ----

export type PermissibleUser = (UserData) & { permissions?: Permissions }

type Intersect<T> = (T extends any ? ((x: T) => 0) : never) extends ((x: infer R) => 0) ? R : never
type _CombinedPermission<T extends object> = DeepPartial<Intersect<T[keyof T]>>
type _AllCombinedPermissions = {
    [P in keyof typeof Permission]: _CombinedPermission<(typeof Permission)[P]>
}

export type AllPermissions = Intersect<_AllCombinedPermissions[keyof _AllCombinedPermissions]>;
export type PermissionRegistry<T> = { [P in keyof T]: Permissions }
export type Permissions = Partial<AllPermissions>;

declare const phantom: unique symbol;
export type AuthorizedUser<T extends Permissions> = PermissibleUser & {
    [phantom]: T
}

export type AuthorizeResult<T extends Permissions> =
    | { type: 'ok', user: AuthorizedUser<T> }
    | { type: 'fail', reason: string }


function flattenKeys(object, initialPathPrefix = '') {
    if (!object || typeof object !== 'object') {
        return [{ [initialPathPrefix]: object }]
    }

    const prefix = initialPathPrefix
        ? Array.isArray(object)
            ? initialPathPrefix
            : `${initialPathPrefix}.`
        : ''

    return Object.keys(object)
        .flatMap((key) =>
            flattenKeys(
                object[key],
                Array.isArray(object) ? `${prefix}[${key}]` : `${prefix}${key}`,
            ),
        )
        .reduce((acc, path) => ({ ...acc, ...path }))
}


function authorize<T extends Permissions>(user: PermissibleUser, permission: T): AuthorizeResult<T> {
    const permissions = derivePermissions(user);
    const requested = flattenKeys(permission);
    for (const path in requested) {
        if (get(permissions, path) !== requested[path]) {
            return { type: 'fail', reason: `User did not meet permission "${path}"` }
        }
    }
    return { type: 'ok', user: user as AuthorizedUser<T> }
}

export function hasPermission<T extends Permissions>(user: PermissibleUser, permission: T): user is AuthorizedUser<T> {
    return DISABLE_PERMISSIONS || authorize(user, permission).type === 'ok';
}

// ---------- permission derivation ----------

type ExclusiveRecord<K extends string | number | symbol, V> = {
    [P in K]?: V
}

export function registerPermisions<E extends object, R extends ExclusiveRecord<keyof E, Permissions>>(type: E, match: (user: PermissibleUser) => E[keyof E] | undefined, registry: R): R
export function registerPermisions<E extends object, V extends E[keyof E], D extends (value: V) => Permissions | void>(type: E, match: (user: PermissibleUser) => V | undefined, derive: D): D
export function registerPermisions<T extends any, D extends (value: T) => Permissions | void>(match: (user: PermissibleUser) => T | undefined, derive: D): D
export function registerPermisions<T extends string | number, R extends ExclusiveRecord<T, Permissions>>(match: (user: PermissibleUser) => T | undefined, registry: R): R
export function registerPermisions(...args) {
    const isEnum = args.length > 2;
    const isFunc = typeof args[args.length - 1] != 'object';
    let en: any;
    if (isEnum) {
        en = args.shift();
    }
    const [match, registry] = args;
    if (isFunc) {
        PermissionDerivations.push(input => {
            const value = match(input);
            return registry(value) || {};
        })
    } else {
        if (isEnum) {
            const maps: any = {};
            for (const key in en) {
                maps[en[key]] = key;
            }
            PermissionDerivations.push(input => {
                const value = match(input);
                if (value in maps) {
                    const key = maps[value];
                    if (key in registry) {
                        return registry[key];
                    }
                }
                return {}
            })
        } else {
            PermissionDerivations.push(input => {
                const value = match(input);
                if (value in registry) {
                    return registry[value];
                }
                return {};
            })
        }
    }
    return registry;
}