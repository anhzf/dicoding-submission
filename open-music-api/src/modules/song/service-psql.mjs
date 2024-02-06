import pg from 'pg';
import { parse } from 'valibot';
import config from '../../config.mjs';
import NotFoundError from '../../errors/not-found.mjs';
import { SongDetailSchema, SongSchema } from './schema.mjs';

const { Pool } = pg;

export default class SongPsqlService {
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
    const result = await this._pool.query(`SELECT * FROM ${SongPsqlService.#TABLE_NAME} WHERE id = $1`, [id]);
    const [item] = result.rows;

    if (!item) throw new NotFoundError('Song tidak ditemukan');

    return parse(SongDetailSchema, item);
  }

  /**
   * @param {import('./types').SongQuery} query
   */
  async list(query) {
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

    const columns = Object.keys(SongSchema.entries);
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await this._pool.query(`SELECT ${columns.join(',')} FROM ${SongPsqlService.#TABLE_NAME} ${whereClause}`, values);
    return result.rows.map((item) => parse(SongSchema, item));
  }

  /**
   *
   * @param {Omit<import('valibot').Input<typeof SongSchema>, 'id'>} payload
   */
  async create(payload) {
    const parsed = parse(SongSchema, payload);
    const result = await this._pool.query(`INSERT INTO ${SongPsqlService.#TABLE_NAME} VALUES($1, $2, $3) RETURNING id`, [
      parsed.id,
      parsed.title,
      parsed.year,
    ]);

    return result.rows[0].id;
  }

  /**
   *
   * @param {import('valibot').Input<typeof SongSchema>} payload
   */
  async update(payload) {
    const parsed = parse(SongSchema, payload);
    const result = await this._pool.query(`UPDATE ${SongPsqlService.#TABLE_NAME} SET title = $1, year = $2 WHERE id = $3 RETURNING id`, [
      parsed.title,
      parsed.year,
      parsed.id,
    ]);

    return result.rows[0].id;
  }

  /**
   * @param {string} id
   */
  async destroy(id) {
    const result = await this._pool.query(`DELETE FROM ${SongPsqlService.#TABLE_NAME} WHERE id = $1`, [id]);

    if (!result.rowCount) throw new NotFoundError('Song tidak ditemukan');
  }
}
