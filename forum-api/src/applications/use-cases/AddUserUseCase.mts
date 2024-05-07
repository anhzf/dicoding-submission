import type UserRepository from '../../domains/users/UserRepository.mjs';
import RegisterUser from '../../domains/users/entities/RegisterUser.mjs';
import type PasswordHash from '../security/PasswordHash.mjs';

export default class AddUserUseCase {
  #userRepository: UserRepository;
  #passwordHash: PasswordHash;

  constructor({ userRepository, passwordHash }: { userRepository: UserRepository, passwordHash: PasswordHash }) {
    this.#userRepository = userRepository;
    this.#passwordHash = passwordHash;
  }

  async execute(useCasePayload: ConstructorParameters<typeof RegisterUser>[0]) {
    const registerUser = new RegisterUser(useCasePayload);
    await this.#userRepository.verifyUsername(registerUser.username);
    registerUser.password = await this.#passwordHash.hash(registerUser.password);
    return this.#userRepository.create(registerUser);
  }
}
