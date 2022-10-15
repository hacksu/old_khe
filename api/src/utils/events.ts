/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { uniqueId } from 'lodash';
import { FieldPath, FieldPathValue } from 'react-hook-form';


type EventCallback = (...args: any[]) => any;
type EventsDefinition = EventCallback | {
    [key: string]: EventsDefinition
}

type ReturnVoidAny<C extends (...args: any[]) => any> = (...args: Parameters<C>) => any | void;

// @ts-ignore
type EventKeys<T extends EventsDefinition, K = FieldPath<T>, V = { [P in K]: FieldPathValue<T, P> extends EventCallback ? P : never }> = keyof {
    // @ts-ignore
    [P in keyof V as V[P]]: true;
}

export class Events<T extends Record<string, EventsDefinition>, Keys = EventKeys<T>> {

    private listeners = new Map<string, Map<string, Function>>();

    /** Subscribe to an event */
    // @ts-ignore
    subscribe<Key extends FieldPath<T>, Callback extends FieldPathValue<T, Key>>(event: Key & Keys, callback: ReturnVoidAny<Callback>) {
        const id = uniqueId(`event_${event}_listener`);
        if (!this.listeners.has(event)) this.listeners.set(event, new Map());
        this.listeners.get(event)?.set(id, callback);
        return () => this.listeners.get(event)?.delete(id);
    }

    /** Emit an event */
    // @ts-ignore
    push<Key extends FieldPath<T>, Callback extends FieldPathValue<T, Key>>(event: Key & Keys, ...args: Parameters<Callback>) {
        this.listeners.get(event)?.forEach((callback) => {
            callback(...args);
        })
    }

    on = this.subscribe;
    emit = this.push;

    /** Retrieve a event instance to handle a specific event */
    // @ts-ignore
    get<Key extends FieldPath<T>, Args = Parameters<FieldPathValue<T, Key>>>(event: Key & Keys) {

        const self = this;

        const target = (function (...params) {
            self.push(event, ...params as any);
        });

        const proto: {
            subscribe(cb: FieldPathValue<T, Key>)
        } = {
            subscribe: function (cb) {
                return self.subscribe(event, cb as any);
            }
        };

        // @ts-ignore
        target.__proto__ = Object.assign({
            on: proto.subscribe,
            emit: target,
        }, proto);

        // return target as FieldPathValue<T, Key>;

        return target as any as {
            // @ts-ignore
            new(...args: Args): void;
            // @ts-ignore
            emit(...args: Args): void;

            subscribe: (typeof proto)['subscribe'],
            on: (typeof proto)['subscribe'],
        } & FieldPathValue<T, Key>;
    }

}


// type stuff = {
//     /** wat  */
//     heya(): string
// }

// type bruh = stuff['heya']

// const hmmm: bruh = function() {
//     return 'hi'
// };
