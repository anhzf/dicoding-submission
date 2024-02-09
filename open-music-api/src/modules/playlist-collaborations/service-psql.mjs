// @ts-check
import AuthorizationError from '../../errors/authorization.mjs';
import ClientError from '../../errors/client.mjs';
import InvariantError from '../../errors/invariant.mjs';
import NotFoundError from '../../errors/not-found.mjs';
import { getPool } from '../../utils/db.mjs';
import { swapValuesToKeys } from '../../utils/object.mjs';
import { PlaylistCollaborationSchema } from './schema.mjs';

/**
 * @typedef {import('./types').PlaylistCollaborationService} Service
 * @typedef {import('./schema.mjs').PlaylistCollaborationPayloadSchema} PayloadSchema
 * @typedef {import('valibot').Output<PayloadSchema>} Payload
 * @typedef {import('pg').QueryConfig} QueryConfig
 */

const SourceToModelKeys = {
  ...Object.fromEntries(Object.entries(PlaylistCollaborationSchema).map(([k]) => [k, k])),
  playlist_id: 'playlistId',
  user_id: 'userId',
};

const ModelToSourceKeys = swapValuesToKeys(SourceToModelKeys);

/** @implements {Service} */
export default class PlaylistCollaborationPsqlService {
  /** @type {import('pg').Pool} */
  #pool;

  constructor() {
    this.#pool = getPool();
  }

  /**
   * @param {Payload} payload
   */
  async addCollaborator(payload) {
    const data = {
      ...payload,
      id: PlaylistCollaborationSchema.entries.id.default(),
    };

    const cols = Object.keys(PlaylistCollaborationSchema.entries)
      .map((k) => ModelToSourceKeys[k] || k);
    const colBinds = cols.map((_, i) => `$${i + 1}`);

    /** @satisfies {QueryConfig} */
    const query = {
      text: `INSERT INTO playlist_collaborations (${cols.join()})
      VALUES (${colBinds.join()})
      RETURNING id`,
      values: cols.map((k) => data[SourceToModelKeys[k] || k]),
    };

    try {
      const { rows: [row] } = await this.#pool.query(query);

      if (!row) throw new InvariantError('Kolaborasi gagal ditambahkan');

      return row.id;
    } catch (err) {
      if (err instanceof ClientError) throw err;
      if (err.code === '23502') throw new InvariantError('Kolaborasi gagal ditambahkan');
      if (err.code === '23503') throw new NotFoundError('Kolaborasi gagal ditambahkan');
      if (err.code === '23505') throw new InvariantError('Kolaborasi sudah ada');
      throw err;
    }
  }

  /**
   * @param {Payload} payload
   */
  async deleteCollaborator(payload) {
    const { playlistId, userId } = payload;

    /** @satisfies {QueryConfig} */
    const query = {
      text: 'DELETE FROM playlist_collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    await this.#pool.query(query);
  }

  /**
   * @param {Payload} payload
   */
  async verifyAccess({ playlistId, userId }) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: 'SELECT * FROM playlist_collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const { rows } = await this.#pool.query(query);

    if (!rows.length) throw new AuthorizationError('Anda tidak memiliki akses ke playlist ini');
  }
}
