import type AuthenticationRepository from '../../domains/authentications/AuthenticationRepository.mjs';

export default class DeleteAuthenticationUseCase {
  #authenticationRepository: AuthenticationRepository;

  constructor({ authenticationRepository }: { authenticationRepository: AuthenticationRepository }) {
    this.#authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload: { refreshToken: string; }) {
    this.#validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this.#authenticationRepository.checkTokenAvailability(refreshToken);
    await this.#authenticationRepository.deleteToken(refreshToken);
  }

  #validatePayload(payload: { refreshToken: string; }) {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
