import { UserData } from '../../models/user';
import { Events } from '../../utils/events';


const events = new Events<{

    /** Triggered when a user logs in */
    loggedIn($: { user: UserData })

    /** Triggered when a user logs out */
    loggedOut($: { user: UserData })

}>;

export const AuthenticationEvents = events;

export const LoggedInEvent = events.get('loggedIn');
export const LoggedOutEvent = events.get('loggedOut');

