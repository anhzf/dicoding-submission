import { token } from '@hapi/jwt';
import InvariantError from '../../errors/invariant.mjs';
import config from '../../config.mjs';

const TokenManager = {
  createAccessToken: (payload) => token.generate(payload, config.accessTokenKey),
  createRefreshToken: (payload) => token.generate(payload, config.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = token.decode(refreshToken, config.refreshTokenKey);
      token.verifySignature(artifacts, config.refreshTokenKey);

      return artifacts.decoded.payload;
    } catch (err) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

export default TokenManager;
