import { safeParse } from 'valibot';
import InvariantError from '../../errors/invariant.mjs';
import { UserPayloadSchema } from './schema.mjs';

/**
 * @typedef {import('valibot').Input<UserPayloadSchema>} Payload
 */

const UserValidator = {
  /**
   *
   * @param {Payload} payload
   */
  validatePayload: (payload) => {
    const result = safeParse(UserPayloadSchema, payload, { abortEarly: true });
    if (!result.success) throw new InvariantError(result.issues[0].message);
    return result.output;
  },
};

export default UserValidator;
