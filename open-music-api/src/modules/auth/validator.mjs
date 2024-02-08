import { safeParse } from 'valibot';
import InvariantError from '../../errors/invariant.mjs';
import { DeleteSchema, PostSchema, PutSchema } from './schema.mjs';

const AuthValidator = {
  /**
   * @param {unknown} payload
   */
  validatePostPayload: (payload) => {
    const result = safeParse(PostSchema, payload, { abortEarly: true });
    if (!result.success) throw new InvariantError(result.issues[0].message);
    return result.output;
  },
  /**
   * @param {unknown} payload
   */
  validatePutPayload: (payload) => {
    const result = safeParse(PutSchema, payload, { abortEarly: true });
    if (!result.success) throw new InvariantError(result.issues[0].message);
    return result.output;
  },
  /**
   * @param {unknown} payload
   */
  validateDeletePayload: (payload) => {
    const result = safeParse(DeleteSchema, payload, { abortEarly: true });
    if (!result.success) throw new InvariantError(result.issues[0].message);
    return result.output;
  },
};

export default AuthValidator;
