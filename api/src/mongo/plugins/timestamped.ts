import { Schema } from "mongoose";
import { z } from 'zod';


export const TimestampOptions = {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated',
    }
}

export function TimestampPlugin(schema: Schema, options: any) {
    const created = {
        type: Date,
        default: Date.now,
    }
    schema.add({
        created,
        updated: created
    })
}