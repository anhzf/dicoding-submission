import type RegisterUser from './entities/RegisterUser.mjs';
import type RegisteredUser from './entities/RegisteredUser.mjs';

export default abstract class UserRepository {
  abstract create(payload: RegisterUser): Promise<RegisteredUser>;

  abstract verifyUsername(username: string): Promise<void>;

  abstract getPasswordByUsername(username: string): Promise<string>;

  abstract getIdByUsername(username: string): Promise<string>;
}
