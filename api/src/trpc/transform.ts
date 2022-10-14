import superjson from 'superjson';

/** @exports 'trpc/transform' */

export const transformer = {
    input: {
        serialize: obj => superjson.serialize(obj),
        deserialize: str => superjson.deserialize(str),
        stringify: obj => superjson.stringify(obj),
    },
    output: {
        serialize: obj => superjson.serialize(obj),
        deserialize: str => superjson.deserialize(str),
    }
}
