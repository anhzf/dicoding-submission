import type { Pool } from 'pg';
import InvariantError from '../../commons/exceptions/InvariantError.mjs';
import AuthenticationRepository from '../../domains/authentications/AuthenticationRepository.mjs';

export default class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  #pool: Pool;

  constructor(pool: Pool) {
    super();
    this.#pool = pool;
  }

  async addToken(token: string) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this.#pool.query(query);
  }

  async checkTokenAvailability(token: string) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.#pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token: string) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.#pool.query(query);
  }
}
