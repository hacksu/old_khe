import { ticketData } from '../../models/ticket';
import { access } from '../../services/authentication/rbac/middleware';
import { t } from '../../trpc';
import { Ticket } from './model';


namespace Input {

    /** Fetch by ID */
    export const ID = ticketData.shape._id;

    /** Filter tickets by fields */
    export const FILTER = ticketData.pick({
        status: true,
        name: true,
        subject: true,
        email: true
    }).partial().nullable();

    /** Create a ticket */
    export const CREATE = ticketData.pick({
        name: true,
        email: true,
        subject: true,
        message: true,
    });

    /** Update a ticket */
    export const UPDATE = ticketData.pick({ _id: true }).merge(
        ticketData.omit({ _id: true }).partial()
    );

}



const get = t.procedure
    .input(Input.ID)
    .use(access({ tickets: { read: true }}))
    .query(async ({ input, ctx }) => {
        console.log('tickets.get', input);
        const ticket = await Ticket.Model.findById(input);
        return { ticket }
    });

const list = t.procedure
    .input(Input.FILTER.default({}))
    .use(access({ tickets: { read: true }}))
    .query(async ({ input, ctx }) => {
        console.log('tickets.list', input);
        const tickets = await Ticket.Model.find(input || {}).lean();
        return { tickets }
    });

const create = t.procedure
    .input(Input.CREATE)
    .mutation(async ({ input, ctx }) => {
        // TODO: create ticket
        console.log('tickets.create', input);
        const ticket = new Ticket.Model(input);
        // TODO: audit
        await ticket.save();
        return { ticket };
    });

const update = t.procedure
    .input(Input.UPDATE)
    .use(access({ tickets: { write: true }}))
    .mutation(async ({ input, ctx }) => {
        // TODO: update ticket
        console.log('tickets.update', input)
        const ticket = await Ticket.Model.findById(input);
        if (ticket) {
            Object.assign(ticket, input);
            await ticket.save();
            return { success: true, ticket: ticket.toObject() }
        }
        return { success: false, ticket: null }
    });

const remove = t.procedure
    .input(Input.ID)
    .use(access({ tickets: { delete: true }}))
    .mutation(async ({ input, ctx }) => {
        // TODO: delete ticket
        console.log('ticket.delete', input)
        return { success: false }
    });


export const ticketsRouter = t.router({
    get,
    list,
    create,
    update,
    remove,
})
