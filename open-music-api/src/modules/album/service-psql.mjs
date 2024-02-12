// @ts-check
import { parse } from 'valibot';
import InvariantError from '../../errors/invariant.mjs';
import NotFoundError from '../../errors/not-found.mjs';
import { getPool } from '../../utils/db.mjs';
import { swapValuesToKeys } from '../../utils/object.mjs';
import {
  AlbumExpandedSchema, AlbumPayloadSchema, AlbumSchema, UserAlbumLikeSchema,
} from './schema.mjs';

/**
 * @typedef {import('./types').AlbumService} Service
 * @typedef {import('../storage/types').StorageService} StorageService
 * @typedef {import('../caching/types').CacheService} CacheService
 * @typedef {import('pg').QueryConfig} QueryConfig
 */

const UserAlbumLikeToSourceKeyMap = {
  ...Object.fromEntries(Object.keys(UserAlbumLikeSchema.entries).map((key) => [key, key])),
  userId: 'user_id',
  albumId: 'album_id',
};

const UserAlbumLikeToModelKeyMap = swapValuesToKeys(UserAlbumLikeToSourceKeyMap);

/** @implements {Service} */
export default class AlbumPsqlService {
  static #TABLE_NAME = 'albums';

  #pool = getPool();

  /** @type {StorageService} */
  #storageService;

  /**
   * @param {StorageService} storageService
   */
  constructor(storageService) {
    this.#storageService = storageService;
  }

  /**
   * @param {string} id
   */
  async get(id) {
    const result = await this.#pool.query(`SELECT * FROM ${AlbumPsqlService.#TABLE_NAME} WHERE id = $1`, [id]);
    const [item] = result.rows;

    if (!item) throw new NotFoundError('Album tidak ditemukan');

    item.cover = item.cover && this.#storageService.getUrl(item.cover);

    return parse(AlbumExpandedSchema, item);
  }

  async list() {
    const result = await this.#pool.query(`SELECT * FROM ${AlbumPsqlService.#TABLE_NAME}`);
    return result.rows.map((item) => parse(AlbumSchema, { ...item, cover: this.#storageService.getUrl(item.cover) }));
  }

  /**
   * @param {import('valibot').Output<typeof AlbumPayloadSchema>} payload
   */
  async create(payload) {
    const data = { ...payload, id: AlbumSchema.entries.id.default() };
    const cols = Object.keys(AlbumPayloadSchema.entries).concat('id');
    const colsBind = cols.map((_, i) => `$${i + 1}`).join();
    const values = cols.map((col) => data[col]);

    const result = await this.#pool.query(
      `INSERT INTO ${AlbumPsqlService.#TABLE_NAME} (${cols.join()}) VALUES(${colsBind}) RETURNING id`,
      values,
    );

    return result.rows[0].id;
  }

  /**
   * @param {import('valibot').Output<typeof AlbumPayloadSchema> & {id: string}} payload
   */
  async update({ id, ...payload }) {
    const cols = Object.keys(AlbumPayloadSchema.entries);
    const colsBind = cols.map((col, i) => `${col} = $${i + 1}`).join();
    const values = cols.map((col) => payload[col]).concat(id);

    const result = await this.#pool.query(
      `UPDATE ${AlbumPsqlService.#TABLE_NAME} SET ${colsBind} WHERE id = $${cols.length + 1} RETURNING id`,
      values,
    );

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');

    return result.rows[0].id;
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    const result = await this.#pool.query(`DELETE FROM ${AlbumPsqlService.#TABLE_NAME} WHERE id = $1`, [id]);
    if (!result.rowCount) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  }

  /**
   * @param {string} id
   * @param {import('stream').Readable} file
   */
  async setCover(id, file) {
    const uploadResult = await this.#storageService.upload(`albums/${id}`, file);

    /** @satisfies {QueryConfig} */
    const query = {
      text: `UPDATE ${AlbumPsqlService.#TABLE_NAME} SET cover = $1 WHERE id = $2`,
      values: [uploadResult, id],
    };

    await this.#pool.query(query);
  }

  /**
   * @param {string} id
   * @param {string} userId
   */
  async like(id, userId) {
    const data = { userId, albumId: id };
    const cols = Object.keys(UserAlbumLikeSchema.entries)
      .map((key) => UserAlbumLikeToSourceKeyMap[key] || key);
    const colsBind = cols.map((_, i) => `$${i + 1}`).join();

    /** @satisfies {QueryConfig} */
    const query = {
      text: `INSERT INTO user_album_likes (${cols.join()}) VALUES(${colsBind})`,
      values: cols.map((col) => data[UserAlbumLikeToModelKeyMap[col]]),
    };

    try {
      await this.#pool.query(query);
    } catch (err) {
      if (err.code === '23502') throw new NotFoundError('User tidak ditemukan');
      if (err.code === '23503') throw new NotFoundError('Album tidak ditemukan');
      if (err.code === '23505') throw new InvariantError('Anda sudah menyukai album ini');
      throw err;
    }
  }

  /**
   * @param {string} id
   * @param {string} userId
   */
  async unlike(id, userId) {
    const data = { userId, albumId: id };
    const cols = Object.keys(UserAlbumLikeSchema.entries)
      .map((key) => UserAlbumLikeToSourceKeyMap[key] || key);
    const conditions = cols.map((col, i) => `${col} = $${i + 1}`);

    /** @satisfies {QueryConfig} */
    const query = {
      text: `DELETE FROM user_album_likes WHERE ${conditions.join(' AND ')}`,
      values: cols.map((col) => data[UserAlbumLikeToModelKeyMap[col]]),
    };

    await this.#pool.query(query);
  }

  /**
   * @param {string} id
   */
  async likesCount(id) {
    const result = await this.#pool.query(
      `SELECT COUNT(*) FROM user_album_likes WHERE ${UserAlbumLikeToSourceKeyMap.albumId} = $1`,
      [id],
    );

    return Number(result.rows[0].count);
  }
}
