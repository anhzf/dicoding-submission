import pg from 'pg';
import config from './config.mjs';

export default class PlaylistService {
  #pool = new pg.Pool({
    host: config.pg.host,
    port: config.pg.port,
    user: config.pg.user,
    password: config.pg.password,
    database: config.pg.database,
  });

  /** @param {string} id */
  async get(id) {
    /** @satisfies {QueryConfig} */
    const query = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [id],
    };
    const { rows } = await this.#pool.query(query);

    return rows[0];
  }

  /** @param {string} id */
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

    return rows;
  }
}
