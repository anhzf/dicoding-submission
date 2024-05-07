import type { HapiJwt } from '@hapi/jwt';
import AuthenticationTokenManager from '../../applications/security/AuthenticationTokenManager.mjs';
import InvariantError from '../../commons/exceptions/InvariantError.mjs';

export default class JwtTokenManager extends AuthenticationTokenManager {
  constructor(private jwt: HapiJwt.Token) {
    super();
  }

  async createAccessToken(payload: HapiJwt.Payload) {
    return this.jwt.generate(payload, import.meta.env.VITE_ACCESS_TOKEN_KEY!);
  }

  async createRefreshToken(payload: HapiJwt.Payload) {
    return this.jwt.generate(payload, import.meta.env.VITE_REFRESH_TOKEN_KEY!);
  }

  async verifyRefreshToken(token: string) {
    try {
      const artifacts = this.jwt.decode(token);
      this.jwt.verify(artifacts, import.meta.env.VITE_REFRESH_TOKEN_KEY!);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token: string) {
    const artifacts = this.jwt.decode(token);
    return artifacts.decoded.payload;
  }
}
