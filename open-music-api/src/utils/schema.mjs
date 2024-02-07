import { nullable, optional } from 'valibot';

export const orNull = (schema) => optional(nullable(schema), null);
