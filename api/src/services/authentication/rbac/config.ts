import { RegistrationStatus } from '../../../models/registration';
import { UserRole } from '../../../models/user';
import { registerPermisions, Permission, derivePermissions } from './permissions';
const register = registerPermisions;


export const DISABLE_PERMISSIONS = true;
if (DISABLE_PERMISSIONS) register(user => user.email, () => ({
    ...Permission.Tickets.All,
    ...Permission.Users.All,
}));


/** Define permissions for roles
 * - These permissions will be applied to users matching the defined roles
 * @see {@link derivePermissions}
 */
register(UserRole, user => user.role, {
    Admin: {
        ...Permission.Tickets.All,
        ...Permission.Users.All,
    },
    User: {
        ...Permission.Tickets.Read,
    }
})


/** Define permissions for user status
 * - These permissions will be applied to users matching the defined statuses
 * @see {@link derivePermissions}
 */
register(RegistrationStatus, user => user?.application?.status, {

})


register(user => user.email, {
    ['cseitz5@kent.edu']: {
        ...Permission.Users.All,
    }
})

// @ts-ignore
// console.log(derivePermissions({ email: 'cseitz5@kent.edu', role: UserRole.User }))