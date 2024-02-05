import { Pool } from 'pg';
import { parse } from 'valibot';
import config from '../config.mjs';
import NotFoundError from '../errors/not-found.mjs';
import { AlbumSchema } from '../schemas.mjs';

export default class AlbumService {
  static #TABLE_NAME = 'albums';

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
    const result = await this._pool.query(`SELECT * FROM ${AlbumService.#TABLE_NAME} WHERE id = $1`, [id]);
    const [item] = result.rows;

    if (!item) throw new NotFoundError('Album tidak ditemukan');

    return parse(AlbumSchema, item);
  }

  async list() {
    const result = await this._pool.query(`SELECT * FROM ${AlbumService.#TABLE_NAME}`);
    return result.rows.map((item) => parse(AlbumSchema, item));
  }

  /**
   *
   * @param {Omit<import('valibot').Input<typeof AlbumSchema>, 'id'>} payload
   */
  async create(payload) {
    const parsed = parse(AlbumSchema, payload);
    const result = await this._pool.query(`INSERT INTO ${AlbumService.#TABLE_NAME} VALUES($1, $2, $3) RETURNING id`, [
      parsed.id,
      parsed.name,
      parsed.year,
    ]);

    return result.rows[0].id;
  }

  /**
   *
   * @param {import('valibot').Input<typeof AlbumSchema>} payload
   */
  async update(payload) {
    const parsed = parse(AlbumSchema, payload);
    const result = await this._pool.query(`UPDATE ${AlbumService.#TABLE_NAME} SET name = $1, year = $2 WHERE id = $3 RETURNING id`, [
      parsed.name,
      parsed.year,
      parsed.id,
    ]);

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');

    return result.rows[0].id;
  }
}
