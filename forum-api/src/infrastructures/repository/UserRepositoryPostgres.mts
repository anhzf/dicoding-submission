import type { Pool } from 'pg';
import InvariantError from '../../commons/exceptions/InvariantError.mjs';
import UserRepository from '../../domains/users/UserRepository.mjs';
import type RegisterUser from '../../domains/users/entities/RegisterUser.mjs';
import RegisteredUser from '../../domains/users/entities/RegisteredUser.mjs';

export default class UserRepositoryPostgres extends UserRepository {
  #pool: Pool;
  #idGenerator: () => string;

  constructor(pool: Pool, idGenerator: () => string) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async verifyUsername(username: string) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#pool.query(query);

    if (result.rowCount) throw new InvariantError('username tidak tersedia');
  }

  async create(registerUser: RegisterUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this.#idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this.#pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username: string) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username: string) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }
}
