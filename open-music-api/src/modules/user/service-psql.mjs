// @ts-check
import { compareSync, hashSync } from 'bcrypt';
import { parse } from 'valibot';
import AuthError from '../../errors/auth.mjs';
import InvariantError from '../../errors/invariant.mjs';
import NotFoundError from '../../errors/not-found.mjs';
import { getPool } from '../../utils/db.mjs';
import { UserPayloadSchema, UserPublicSchema, UserSchema } from './schema.mjs';

/**
 * @typedef {import('pg').Pool} Pool
 * @typedef {import('./types').UserService} UserService
 * @typedef {import('./schema.mjs').UserPayloadSchema} UserPayloadSchema
 * @typedef {import('valibot').Output<UserPayloadSchema>} Payload
 */

/** @implements {UserService} */
export default class UserPsqlService {
  /** @type {Pool} */
  #pool;

  constructor() {
    this.#pool = getPool();
  }

  /** @param {string} id */
  async get(id) {
    const cols = Object.keys(UserPublicSchema.entries);
    const { rows: [row] } = await this.#pool.query(
      `SELECT ${cols.join()} FROM users WHERE id = $1 LIMIT 1`,
      [id],
    );

    if (!row) throw new NotFoundError('User tidak ditemukan');

    return parse(UserPublicSchema, row);
  }

  /** @param {Payload} payload */
  async register(payload) {
    const hashed = UserPsqlService.#hash(payload.password);
    const data = {
      ...payload,
      password: hashed,
      id: UserSchema.entries.id.default(),
    };

    const cols = Object.keys(UserPayloadSchema.entries).concat('id');
    const colBinds = cols.map((_, i) => `$${i + 1}`);

    try {
      const { rows: [row] } = await this.#pool.query(
        `INSERT INTO users (${cols.join()}) VALUES (${colBinds.join()}) RETURNING id`,
        cols.map((col) => data[col]),
      );

      return row.id;
    } catch (err) {
      if (err.code === '23505') throw new InvariantError('Username sudah digunakan');
      throw err;
    }
  }

  /** @param {string} username */
  async verifyUsername(username) {
    const { rows } = await this.#pool.query('SELECT id FROM users WHERE username = $1 LIMIT 1', [username]);
    if (rows.length) throw new InvariantError('Username sudah digunakan');
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async verifyCredential(username, password) {
    const { rows } = await this.#pool.query('SELECT id, password FROM users WHERE username = $1 LIMIT 1', [username]);

    if (!rows.length) throw new AuthError('Kredensial tidak valid');

    const { id, password: hashedPassword } = rows[0];
    const match = compareSync(password, hashedPassword);

    if (!match) throw new AuthError('Kredensial tidak valid');

    return id;
  }

  /** @param {string} password */
  static #hash(password) {
    return hashSync(password, 10);
  }
}
