import { isArray, merge } from 'lodash';
import { Model, model, models, ObtainDocumentType, Schema, SchemaDefinition, SchemaDefinitionType, SchemaOptions } from 'mongoose';
const MongooseSchema = Schema;

export type SchemaOpts<S = any> = SchemaOptions<'type', ObtainDocumentType<any, S>>;
export type SchemaQueryHelpers<S = any> = SchemaOpts<S>['query'];
export function buildModel<TSchema = {}, Type = any, C = ConstructorParameters<typeof Schema<Schema>>, S = Schema<TSchema, Model<TSchema, any, any, any, any>, {}, {}, any, {}, "type", ObtainDocumentType<any, TSchema, "type">>>(
    name: string,
    schemaDef: ObtainDocumentType<any, TSchema, "type"> | SchemaDefinition<SchemaDefinitionType<TSchema>> = {},
    opts: SchemaOpts<TSchema> & {
        plugins?: (any | [any, any])[]
    } = {},
    applyBefore?: (schema: S) => S | null,
    applyAfter?: (schema: S) => S | null,
) {
    if (name in models) {
        return models[name] as Type;
    }
    const { plugins = [], ..._opts } = opts
    const schema = new Schema<TSchema>(schemaDef, merge(_opts, <typeof _opts>{
        strict: false,
        toJSON: {
            virtuals: true,
        },
        query: {

        }
    }));
    if (applyBefore) {
        // @ts-ignore
        applyBefore(schema);
    }
    for (const plugin of plugins) {
        if (isArray(plugin)) {
            schema.plugin(plugin[0], plugin?.[1] || {});
        } else {
            schema.plugin(plugin);
        }
    }
    if (applyAfter) {
        // @ts-ignore
        applyAfter(schema);
    }
    return model<TSchema, Type>(name, schema) as Type;
}