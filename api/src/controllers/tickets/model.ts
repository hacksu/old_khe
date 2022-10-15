import { HydratedDocument, Model, Types } from 'mongoose';
import { ticketData, TicketData, TicketStatus } from '../../models/ticket';
import { buildModel } from '../../mongo/model';
import { TimestampOptions, TimestampPlugin } from '../../mongo/plugins/timestamped';


export namespace TicketPermissions {
    export const Read = { tickets: { read: true } } as const;
    export const Write = { tickets: { write: true, read: true } } as const;
    export const Delete = { tickets: { delete: true } } as const;
}


/** Define the Ticket Model */
export namespace Ticket {
    export type Data = TicketData;
    export type Schema = Data & {}
    export type Document = HydratedDocument<Schema>;

    type Type = Model<Schema, typeof QueryHelpers>;
    const QueryHelpers = {}

    export const data = ticketData;
    export const Model = buildModel<Schema, Type>('Ticket', {
        status: {
            type: String,
            enum: TicketStatus,
            default: TicketStatus.Open,
        },
        assignee: {
            type: Types.ObjectId,
            ref: 'User'
        }
    }, {
        ...TimestampOptions,
        query: QueryHelpers,
        plugins: [
            TimestampPlugin,
        ]
    })

}
