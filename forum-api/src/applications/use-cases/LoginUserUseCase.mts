import type AuthenticationRepository from '../../domains/authentications/AuthenticationRepository.mjs';
import NewAuth from '../../domains/authentications/entities/NewAuth.js';
import type UserRepository from '../../domains/users/UserRepository.mjs';
import UserLogin from '../../domains/users/entities/UserLogin.mjs';
import type AuthenticationTokenManager from '../security/AuthenticationTokenManager.mjs';
import type PasswordHash from '../security/PasswordHash.mjs';

export default class LoginUserUseCase {
  #userRepository: UserRepository;
  #authenticationRepository: AuthenticationRepository;
  #authenticationTokenManager: AuthenticationTokenManager;
  #passwordHash: PasswordHash;

  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }: {
    userRepository: UserRepository,
    authenticationRepository: AuthenticationRepository,
    authenticationTokenManager: AuthenticationTokenManager,
    passwordHash: PasswordHash,
  }) {
    this.#userRepository = userRepository;
    this.#authenticationRepository = authenticationRepository;
    this.#authenticationTokenManager = authenticationTokenManager;
    this.#passwordHash = passwordHash;
  }

  async execute(useCasePayload: ConstructorParameters<typeof UserLogin>[0]) {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this.#userRepository.getPasswordByUsername(username);

    await this.#passwordHash.compare(password, encryptedPassword);

    const id = await this.#userRepository.getIdByUsername(username);

    const accessToken = await this.#authenticationTokenManager
      .createAccessToken({ username, id });
    const refreshToken = await this.#authenticationTokenManager
      .createRefreshToken({ username, id });

    const newAuthentication = new NewAuth({
      accessToken,
      refreshToken,
    });

    await this.#authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}
