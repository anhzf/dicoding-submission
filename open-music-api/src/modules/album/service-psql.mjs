import pg from 'pg';
import { parse } from 'valibot';
import config from '../../config.mjs';
import NotFoundError from '../../errors/not-found.mjs';
import { AlbumExpandedSchema, AlbumPayloadSchema, AlbumSchema } from './schema.mjs';

const { Pool } = pg;

export default class AlbumPsqlService {
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
    const result = await this._pool.query(`SELECT * FROM ${AlbumPsqlService.#TABLE_NAME} WHERE id = $1`, [id]);
    const [item] = result.rows;

    if (!item) throw new NotFoundError('Album tidak ditemukan');

    return parse(AlbumExpandedSchema, item);
  }

  async list() {
    const result = await this._pool.query(`SELECT * FROM ${AlbumPsqlService.#TABLE_NAME}`);
    return result.rows.map((item) => parse(AlbumSchema, item));
  }

  /**
   *
   * @param {import('valibot').Output<typeof AlbumPayloadSchema>} payload
   */
  async create(payload) {
    const data = { ...payload, id: AlbumSchema.entries.id.default() };
    const cols = Object.keys(AlbumPayloadSchema.entries).concat('id');
    const colsBind = cols.map((_, i) => `$${i + 1}`).join();
    const values = cols.map((col) => data[col]);

    const result = await this._pool.query(
      `INSERT INTO ${AlbumPsqlService.#TABLE_NAME} (${cols.join()}) VALUES(${colsBind}) RETURNING id`,
      values,
    );

    return result.rows[0].id;
  }

  /**
   *
   * @param {import('valibot').Output<typeof AlbumPayloadSchema> & {id: string}} payload
   */
  async update({ id, ...payload }) {
    const cols = Object.keys(AlbumPayloadSchema.entries);
    const colsBind = cols.map((col, i) => `${col} = $${i + 1}`).join();
    const values = cols.map((col) => payload[col]).concat(id);

    const result = await this._pool.query(
      `UPDATE ${AlbumPsqlService.#TABLE_NAME} SET ${colsBind} WHERE id = $${cols.length + 1} RETURNING id`,
      values,
    );

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');

    return result.rows[0].id;
  }

  async delete(id) {
    const result = await this._pool.query(`DELETE FROM ${AlbumPsqlService.#TABLE_NAME} WHERE id = $1`, [id]);
    if (!result.rowCount) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  }
}
