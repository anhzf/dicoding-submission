/**
 * @typedef {import('./types').Song} Song
 * @typedef {import('./types').SongDetail} SongDetail
 * @typedef {import('./types').SongService} Service
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 */

import Validator from './validator.mjs';

export default class SongHandler {
  /** @type {Service} */
  #service;

  /**
   * @param {Service} service
   */
  constructor(service) {
    this.#service = service;
  }

  /**
   *
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async list(req) {
    const songs = await this.#service.list(req.query);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  /**
   *
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async get(req) {
    const { songId } = req.params;
    const song = await this.#service.get(songId);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  /**
   *
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async post(req, h) {
    const payload = Validator.validatePayload(req.payload);

    const songId = await this.#service.create(payload);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   *
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async put(req) {
    const payload = Validator.validatePayload(req.payload);

    const { songId } = req.params;
    await this.#service.update({ ...payload, id: songId });

    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  /**
   *
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async destroy(req) {
    const { songId } = req.params;
    await this.#service.delete(songId);
    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}
