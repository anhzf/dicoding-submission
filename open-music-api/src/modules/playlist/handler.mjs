import { cacheResponsePayload } from '../caching/utils.mjs';
import Validator from './validator.mjs';

/**
 * @typedef {import('./types').PlaylistService} Service
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 * @typedef {import('../caching/types').CacheService} CacheService
 */

export default class PlaylistHandler {
  /** @type {Service} */
  #service;

  /** @type {CacheService?} */
  #cacheService;

  /**
   * @param {Service} service
   * @param {CacheService?} cacheService
   */
  constructor(service, cacheService) {
    this.#service = service;
    this.#cacheService = cacheService;

    if (cacheService) {
      this.list = cacheResponsePayload(
        cacheService,
        (req) => `playlists:${req.auth.credentials.id}`,
        this.list.bind(this),
      );
      this.listSongs = cacheResponsePayload(
        cacheService,
        (req) => `playlist-songs:${req.params.id}[${req.auth.credentials.id}]`,
        this.listSongs.bind(this),
      );
      this.listActivities = cacheResponsePayload(
        cacheService,
        (req) => `playlist-activities:${req.params.id}[${req.auth.credentials.id}]`,
        this.listActivities.bind(this),
      );
    }
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async list(req, h) {
    const playlists = await this.#service.list(req.auth.credentials.id);
    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async post(req, h) {
    const { id: owner } = req.auth.credentials;
    const payload = Validator.validatePayload({ ...req.payload, owner });

    const playlistId = await this.#service.create(payload);
    this.#cacheService?.delete(`playlists:${owner}`);

    return h.response({
      status: 'success',
      data: {
        playlistId,
      },
    }).code(201);
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async destroy(req, h) {
    const { id: playlistId } = req.params;

    await this.#service.verifyOwner(playlistId, req.auth.credentials.id);
    await this.#service.delete(playlistId);

    await this.#cacheService?.delete(`playlists:${req.auth.credentials.id}[${req.auth.credentials.id}]`);
    await this.#cacheService?.delete(`playlist-songs:${playlistId}[${req.auth.credentials.id}]`);

    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async listSongs(req, h) {
    const { id: playlistId } = req.params;

    await this.#service.verifyAccess(playlistId, req.auth.credentials.id);

    const playlist = await this.#service.get(playlistId);
    playlist.songs = await this.#service.listSongs(playlistId);

    return h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async postSong(req, h) {
    const { id: playlistId } = req.params;
    const { songId } = Validator.validateSongPayload(req.payload);

    await this.#service.verifyAccess(playlistId, req.auth.credentials.id);
    await this.#service.addSong(playlistId, songId);

    this.#service.addActivity({
      action: 'add', playlistId, songId, userId: req.auth.credentials.id,
    });
    await this.#cacheService?.delete(`playlists:${playlistId}`);
    await this.#cacheService?.delete(`playlist-songs:${playlistId}[${req.auth.credentials.id}]`);
    await this.#cacheService?.delete(`playlist-activities:${playlistId}[${req.auth.credentials.id}]`);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    }).code(201);
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async destroySong(req, h) {
    const { id: playlistId } = req.params;
    const { songId } = Validator.validateSongPayload(req.payload);

    await this.#service.verifyAccess(playlistId, req.auth.credentials.id);
    await this.#service.deleteSong(playlistId, songId);

    this.#service.addActivity({
      action: 'delete', playlistId, songId, userId: req.auth.credentials.id,
    });
    await this.#cacheService?.delete(`playlists:${playlistId}`);
    await this.#cacheService?.delete(`playlist-songs:${playlistId}[${req.auth.credentials.id}]`);
    await this.#cacheService?.delete(`playlist-activities:${playlistId}[${req.auth.credentials.id}]`);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async listActivities(req, h) {
    const { id: playlistId } = req.params;

    await this.#service.verifyAccess(playlistId, req.auth.credentials.id);
    const activities = await this.#service.listActivities(playlistId);

    return h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
  }
}
