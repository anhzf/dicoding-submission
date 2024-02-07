/**
 * @typedef {import('./types').Song} Song
 * @typedef {import('./types').SongDetail} SongDetail
 * @typedef {import('./types').SongService} SongService
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 */

import { safeParse } from 'valibot';
import ValibotError from '../../errors/valibot.mjs';
import { SongPayloadSchema } from './schema.mjs';

export default class SongHandler {
  /** @type {SongService} */
  #service;

  /**
   * @param {SongService} service
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
    const parseResult = safeParse(SongPayloadSchema, req.payload, { abortEarly: true });
    if (!parseResult.success) throw new ValibotError(parseResult.issues, 400);

    const songId = await this.#service.create(parseResult.output);

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
    const { songId } = req.params;

    const parseResult = safeParse(SongPayloadSchema, req.payload, { abortEarly: true });
    if (!parseResult.success) throw new ValibotError(parseResult.issues, 400);

    await this.#service.update({ ...parseResult.output, id: songId });

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
