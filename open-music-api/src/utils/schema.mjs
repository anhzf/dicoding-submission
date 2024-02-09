import { nanoid } from 'nanoid';
import { nullable, optional, string } from 'valibot';

/** @param {import('valibot').BaseSchema} */
export const orNull = (schema) => optional(nullable(schema), null);

/** @param {string} prefix */
export const id = (prefix) => optional(string(), () => `${prefix}-${nanoid()}`);
