/**
 * @typedef {import('./types').Album} Album
 * @typedef {import('./types').AlbumService} AlbumService
 * @typedef {import('../song/types').SongService} SongService
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 */

import Validator from './validator.mjs';

/** Satisfy the requirements */
const GetModelKeyMapper = {
  cover: 'coverUrl',
};

export default class AlbumHandler {
  /** @type {AlbumService} */
  #service;

  /** @type {SongService | undefined} */
  #songService;

  /**
   * @param {AlbumService} service
   * @param {{ songService?: SongService; }} param1
   */
  constructor(service, { songService }) {
    this.#service = service;
    this.#songService = songService;
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async list() {
    const albums = await this.#service.list();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async get(req) {
    const { albumId } = req.params;
    const album = await this.#service.get(albumId);
    const songs = await this.#songService?.list({ albumId });
    album.songs = songs;

    const mapped = Object.fromEntries(
      Object.entries(album).map(([key, value]) => [GetModelKeyMapper[key] || key, value]),
    );

    return {
      status: 'success',
      data: {
        album: mapped,
      },
    };
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async post(req, h) {
    const payload = Validator.validatePayload(req.payload);

    const albumId = await this.#service.create(payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async put(req) {
    const { albumId } = req.params;
    const payload = Validator.validatePayload(req.payload);

    await this.#service.update({ ...payload, id: albumId });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async destroy(req) {
    const { albumId } = req.params;
    await this.#service.delete(albumId);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async postCover(req, h) {
    const { albumId } = req.params;
    /** @type {import('../../types').HapiPayloadStream} cover */
    const file = req.payload.cover;

    Validator.validateCoverHeaders(file.hapi.headers);

    await this.#service.setCover(albumId, file);

    return h.response({
      status: 'success',
      message: 'Cover berhasil diperbarui',
    }).code(201);
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async getLikesCount(req) {
    const { albumId } = req.params;
    const likes = await this.#service.likesCount(albumId);
    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async postLike(req, h) {
    const { albumId } = req.params;
    const { id: userId } = req.auth.credentials;

    await this.#service.like(albumId, userId);

    return h.response({
      status: 'success',
      message: 'Album berhasil dilike',
    }).code(201);
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async destroyLike(req) {
    const { albumId } = req.params;
    const { id: userId } = req.auth.credentials;

    await this.#service.unlike(albumId, userId);

    return {
      status: 'success',
      message: 'Album berhasil diunlike',
    };
  }
}
