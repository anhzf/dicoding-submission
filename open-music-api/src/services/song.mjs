import { Pool } from 'pg';
import { parse } from 'valibot';
import config from '../config.mjs';
import NotFoundError from '../errors/not-found.mjs';
import { SongSchema } from '../schemas.mjs';

/**
 * @typedef {{
 *  title?: string;
 *  performer?: string;
 * }} SongQuery
 */

export default class SongService {
  static #TABLE_NAME = 'songs';

  constructor() {
    this._pool = new Pool({
      host: config.pg.host,
      port: config.pg.port,
      user: config.pg.user,
      password: config.pg.password,
      database: config.pg.database,
    });
  }

  /**
   * @param {string} id
   */
  async get(id) {
    const result = await this._pool.query(`SELECT * FROM ${SongService.#TABLE_NAME} WHERE id = $1`, [id]);
    const [item] = result.rows;

    if (!item) throw new NotFoundError('Lagu tidak ditemukan');

    return parse(SongSchema, item);
  }

  /**
   * @param {SongQuery} query
   */
  async list(query = {}) {
    const { title, performer } = query;
    const conditions = [];
    const values = [];

    if (title) {
      conditions.push(`title LIKE $${values.length + 1}`);
      values.push(`%${title}%`);
    }

    if (performer) {
      conditions.push(`performer LIKE $${values.length + 1}`);
      values.push(`%${performer}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await this._pool.query(`SELECT * FROM ${SongService.#TABLE_NAME} ${whereClause}`, values);
    return result.rows.map((item) => parse(SongSchema, item));
  }

  /**
   *
   * @param {Omit<import('valibot').Input<typeof SongSchema>, 'id'>} payload
   */
  async create(payload) {
    const parsed = parse(SongSchema, payload);
    const result = await this._pool.query(`INSERT INTO ${SongService.#TABLE_NAME} VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [
      parsed.id,
      parsed.title,
      parsed.year,
      parsed.performer,
      parsed.genre,
      parsed.duration,
      parsed.albumId,
    ]);

    return result.rows[0].id;
  }

  /**
   *
   * @param {import('valibot').Input<typeof SongSchema>} payload
   */
  async update(payload) {
    const parsed = parse(SongSchema, payload);
    const result = await this._pool.query(`UPDATE ${SongService.#TABLE_NAME} SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, albumId = $6 WHERE id = $7 RETURNING id`, [
      parsed.title,
      parsed.year,
      parsed.performer,
      parsed.genre,
      parsed.duration,
      parsed.albumId,
      parsed.id,
    ]);

    if (!result.rows.length) throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');

    return result.rows[0].id;
  }
}
