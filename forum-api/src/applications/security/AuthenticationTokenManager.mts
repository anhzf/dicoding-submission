/* Prefer using abstract method. */

import type { HapiJwt } from '@hapi/jwt';

export default abstract class AuthenticationTokenManager {
  abstract createAccessToken(payload: HapiJwt.Payload): Promise<string>;

  abstract createRefreshToken(payload: HapiJwt.Payload): Promise<string>;

  abstract verifyRefreshToken(token: string): Promise<void>;

  abstract decodePayload(token: string): Promise<any>;
}
