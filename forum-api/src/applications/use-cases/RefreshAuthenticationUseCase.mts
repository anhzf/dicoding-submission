import type AuthenticationRepository from '../../domains/authentications/AuthenticationRepository.mjs';
import type AuthenticationTokenManager from '../security/AuthenticationTokenManager.mjs';

export default class RefreshAuthenticationUseCase {
  #authenticationRepository: AuthenticationRepository;
  #authenticationTokenManager: AuthenticationTokenManager;

  constructor({
    authenticationRepository,
    authenticationTokenManager,
  }: {
    authenticationRepository: AuthenticationRepository,
    authenticationTokenManager: AuthenticationTokenManager,
  }) {
    this.#authenticationRepository = authenticationRepository;
    this.#authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload: { refreshToken: string; }) {
    this.#verifyPayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this.#authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this.#authenticationRepository.checkTokenAvailability(refreshToken);

    const { username, id } = await this.#authenticationTokenManager.decodePayload(refreshToken);

    return this.#authenticationTokenManager.createAccessToken({ username, id });
  }

  #verifyPayload(payload: { refreshToken: string; }) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
