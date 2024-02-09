import { parse } from 'valibot';
import NotFoundError from '../../errors/not-found.mjs';
import { getPool } from '../../utils/db.mjs';
import {
  SongDetailSchema, SongPayloadSchema, SongSchema,
} from './schema.mjs';
import { swapValuesToKeys } from '../../utils/object.mjs';

const SongSourceToModelKeys = {
  ...Object.fromEntries(Object.entries(SongDetailSchema.entries).map(([key]) => [key, key])),
  album_id: 'albumId',
};

const SongModelToSourceKeys = swapValuesToKeys(SongSourceToModelKeys);

export default class SongPsqlService {
  static #TABLE_NAME = 'songs';

  constructor() {
    this._pool = getPool();
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
    const { title, performer, albumId } = query || {};
    const conditions = [];
    const values = [];

    if (title) {
      conditions.push(`${SongModelToSourceKeys.title} ILIKE $${values.length + 1}`);
      values.push(`${title}%`);
    }

    if (performer) {
      conditions.push(`${SongModelToSourceKeys.performer} ILIKE $${values.length + 1}`);
      values.push(`${performer}%`);
    }

    if (albumId) {
      conditions.push(`${SongModelToSourceKeys.albumId} = $${values.length + 1}`);
      values.push(albumId);
    }

    const columns = Object.keys(SongSchema.entries);
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const q = `SELECT ${columns.join()} FROM ${SongPsqlService.#TABLE_NAME} ${whereClause}`;
    const result = await this._pool.query(q, values);

    return result.rows.map((item) => parse(SongSchema, item));
  }

  /**
   *
   * @param {Omit<import('valibot').Output<typeof SongDetailSchema>, 'id'>} payload
   */
  async create(payload) {
    const data = { ...payload, id: SongSchema.entries.id.default() };
    const cols = Object.keys(SongPayloadSchema.entries).concat('id')
      .map((key) => SongModelToSourceKeys[key]);
    const colsBind = cols.map((_, i) => `$${i + 1}`).join();
    const values = cols.map((col) => data[SongSourceToModelKeys[col] || col]);

    const result = await this._pool.query(
      `INSERT INTO ${SongPsqlService.#TABLE_NAME} (${cols.join()}) VALUES(${colsBind}) RETURNING id`,
      values,
    );

    return result.rows[0].id;
  }

  /**
   *
   * @param {Omit<import('valibot').Output<typeof SongDetailSchema>, 'id'>} payload
   */
  async update({ id, ...payload }) {
    const cols = Object.keys(SongPayloadSchema.entries)
      .map((key) => SongModelToSourceKeys[key]);
    const colsBind = cols.map((col, i) => `${col} = $${i + 1}`).join();
    const values = cols.map((col) => payload[SongSourceToModelKeys[col] || col]).concat(id);

    const result = await this._pool.query(
      `UPDATE ${SongPsqlService.#TABLE_NAME} SET ${colsBind} WHERE id = $${cols.length + 1} RETURNING id`,
      values,
    );

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');

    return result.rows[0].id;
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    const result = await this._pool.query(`DELETE FROM ${SongPsqlService.#TABLE_NAME} WHERE id = $1`, [id]);

    if (!result.rowCount) throw new NotFoundError('Song tidak ditemukan');
  }
}
