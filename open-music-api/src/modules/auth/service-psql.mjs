// @ts-check
import InvariantError from '../../errors/invariant.mjs';
import { getPool } from '../../utils/db.mjs';

/**
 *  @typedef {import('./types').AuthService} AuthService
 */

/** @implements {AuthService} */
export default class AuthPsqlService {
  #pool;

  constructor() {
    this.#pool = getPool();
  }

  async storeRefreshToken(token) {
    await this.#pool.query(
      'INSERT INTO refresh_tokens (token) VALUES ($1)',
      [token],
    );
  }

  async verifyRefreshToken(token) {
    const { rows } = await this.#pool.query(
      'SELECT token FROM refresh_tokens WHERE token = $1',
      [token],
    );

    if (!rows.length) throw new InvariantError('Refresh token tidak valid');
  }

  async destroyRefreshToken(token) {
    await this.#pool.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [token],
    );
  }
}
