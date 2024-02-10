// @ts-check
import { parse } from 'valibot';
import AuthorizationError from '../../errors/authorization.mjs';
import NotFoundError from '../../errors/not-found.mjs';
import { getPool } from '../../utils/db.mjs';
import { swapValuesToKeys } from '../../utils/object.mjs';
import { SongSchema } from '../song/schema.mjs';
import {
  PlaylistActivityItemSchema,
  PlaylistActivityPayloadSchema, PlaylistActivitySchema,
  PlaylistPayloadSchema, PlaylistSchema, PlaylistSongSchema,
} from './schema.mjs';

/**
 * @typedef {import('./types').PlaylistService} Service
 * @typedef {import('valibot').Output<typeof PlaylistPayloadSchema>} PlaylistPayload
 * @typedef {import('valibot').Output<typeof PlaylistActivityPayloadSchema>} ActivityPayload
 * @typedef {import('pg').QueryConfig} QueryConfig
 * @typedef {import('../playlist-collaboration/types').PlaylistCollaborationService} CollaborationService
 */

const PlaylistSongSourceToModelKeys = {
  ...Object.fromEntries(Object.entries(PlaylistSongSchema.entries).map(([k]) => [k, k])),
  playlist_id: 'playlistId',
  song_id: 'songId',
};

const PlaylistSongModelToSourceKeys = swapValuesToKeys(PlaylistSongSourceToModelKeys);

const ActivitySourceToModelKeys = {
  ...Object.fromEntries(Object.entries(PlaylistActivitySchema.entries).map(([k]) => [k, k])),
  playlist_id: 'playlistId',
  user_id: 'userId',
  song_id: 'songId',
};

const ActivityModelToSourceKeys = swapValuesToKeys(ActivitySourceToModelKeys);

/** @implements {Service} */
export default class PlaylistPsqlService {
  /** @type {import('pg').Pool} */
  #pool;

  /** @type {CollaborationService} */
  #collaborationService;

  /**
   * @param {CollaborationService} collaborationService
   */
  constructor(collaborationService) {
    this.#pool = getPool();
    this.#collaborationService = collaborationService;
  }

  /**
   * @param {string} id
   */
  async get(id) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1
      LIMIT 1`,
      values: [id],
    };
    const { rows: [row] } = await this.#pool.query(query);

    if (!row) throw new NotFoundError('Playlist tidak ditemukan');

    return parse(PlaylistSchema, row);
  }

  /**
   * @param {string} userId
   */
  async list(userId) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      JOIN users ON playlists.owner = users.id
      LEFT JOIN playlist_collaborations ON playlists.id = playlist_collaborations.playlist_id
      WHERE playlists.owner = $1 OR playlist_collaborations.user_id = $1
      GROUP BY playlists.id, users.username`,
      values: [userId],
    };
    const { rows } = await this.#pool.query(query);
    return rows;
  }

  /**
   * @param {PlaylistPayload} payload
   */
  async create(payload) {
    const data = {
      ...payload,
      id: PlaylistSchema.entries.id.default(),
    };
    const cols = Object.keys(PlaylistPayloadSchema.entries).concat('id');
    const colBinds = cols.map((_, i) => `$${i + 1}`).join(', ');

    /** @satisfies {QueryConfig} */
    const query = {
      text: `INSERT INTO playlists (${cols.join()}) VALUES (${colBinds}) RETURNING id`,
      values: cols.map((col) => data[col]),
    };
    const { rows } = await this.#pool.query(query);

    return rows[0].id;
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id],
    };
    await this.#pool.query(query);
  }

  /**
   * @param {string} id
   */
  async listSongs(id) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      JOIN playlist_songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };
    const { rows } = await this.#pool.query(query);

    return rows.map((row) => parse(SongSchema, row));
  }

  /**
   * @param {string} playlistId
   * @param {string} songId
   */
  async addSong(playlistId, songId) {
    const data = {
      playlistId,
      songId,
      id: PlaylistSongSchema.entries.id.default(),
    };

    const cols = Object.keys(PlaylistSongSchema.entries)
      .map((col) => PlaylistSongModelToSourceKeys[col] || col);
    const colBinds = cols.map((_, i) => `$${i + 1}`).join(', ');

    /** @satisfies {QueryConfig} */
    const query = {
      text: `INSERT INTO playlist_songs (${cols.join()}) VALUES (${colBinds})`,
      values: cols.map((col) => data[PlaylistSongSourceToModelKeys[col]]),
    };

    try {
      await this.#pool.query(query);
    } catch (err) {
      if (err.code === '23502') throw new NotFoundError('Lagu tidak ditemukan');
      if (err.code === '23503') throw new NotFoundError('Playlist tidak ditemukan');
      if (err.code === '23505') throw new AuthorizationError('Lagu sudah ada di playlist');
      throw err;
    }
  }

  /**
   * @param {string} playlistId
   * @param {string} songId
   */
  async deleteSong(playlistId, songId) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };
    await this.#pool.query(query);
  }

  /**
   * @param {ActivityPayload} payload
   */
  async addActivity(payload) {
    const data = {
      ...payload,
      time: PlaylistActivitySchema.entries.time.default(),
      id: PlaylistActivitySchema.entries.id.default(),
    };

    const cols = Object.keys(PlaylistActivityPayloadSchema.entries).concat('id')
      .map((col) => ActivityModelToSourceKeys[col] || col);
    const colBinds = cols.map((_, i) => `$${i + 1}`);

    /** @satisfies {QueryConfig} */
    const query = {
      text: `INSERT INTO playlist_activities (${cols.join()}) VALUES (${colBinds.join()}) RETURNING id`,
      values: cols.map((col) => data[ActivitySourceToModelKeys[col]]),
    };

    const { rows: [row] } = await this.#pool.query(query);

    return row.id;
  }

  /**
   * @param {string} id
   */
  async listActivities(id) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: `SELECT songs.title, playlist_activities.action,
      playlist_activities.time, users.username
      FROM playlist_activities
      JOIN users ON playlist_activities.user_id = users.id
      JOIN songs ON playlist_activities.song_id = songs.id
      WHERE playlist_activities.playlist_id = $1
      ORDER BY playlist_activities.time ASC`,
      values: [id],
    };
    const { rows } = await this.#pool.query(query);

    return rows.map((row) => parse(PlaylistActivityItemSchema, row));
  }

  /**
   * @param {string} id
   * @param {string} userId
   */
  async verifyOwner(id, userId) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const { rows: [row] } = await this.#pool.query(query);

    if (!row) throw new NotFoundError('Playlist tidak ditemukan');

    if (row.owner !== userId) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  /**
   * @param {string} id
   * @param {string} userId
   */
  async verifyAccess(id, userId) {
    try {
      await this.verifyOwner(id, userId);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;

      await this.#collaborationService?.verifyAccess({ playlistId: id, userId });
    }
  }
}
