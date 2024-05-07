/* Prefer using abstract method. */

import type { HapiJwt } from '@hapi/jwt';

export default abstract class AuthenticationTokenManager {
  abstract createAccessToken(payload: HapiJwt.Payload): Promise<string>;

  abstract createRefreshToken(payload: HapiJwt.Payload): Promise<string>;

  abstract verifyRefreshToken(token: string): Promise<void>;

  abstract decodePayload(token: string): Promise<any>;

  // async createAccessToken(userId: string): Promise<string> {
  //   throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  // };

  // async createRefreshToken(userId: string): Promise<string> {
  //   throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  // }

  // async verifyAccessToken(token: string): Promise<string> {
  //   throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  // }

  // async decodePayload(token: string): Promise<any> {
  //   throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  // }
}
