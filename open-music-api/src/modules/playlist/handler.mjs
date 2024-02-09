import Validator from './validator.mjs';

/**
 * @typedef {import('./types').PlaylistService} Service
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 */

export default class PlaylistHandler {
  /** @type {Service} */
  #service;

  /**
   * @param {Service} service
   */
  constructor(service) {
    this.#service = service;
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
