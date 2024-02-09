import { safeParse } from 'valibot';
import InvariantError from '../errors/invariant.mjs';

/**
 * @template {import('valibot').BaseSchema} T
 * @param {T} schema
 */
export const createValidation = (schema) => (
  /**
   * @param {unknown} payload
   */
  (payload) => {
    const result = safeParse(schema, payload, { abortEarly: true });
    if (!result.success) throw new InvariantError(result.issues[0].message);
    return result.output;
  }
);
