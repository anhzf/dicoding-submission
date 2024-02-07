/**
 * @typedef {import('./types').Album} Album
 * @typedef {import('./types').AlbumService} AlbumService
 * @typedef {import('../song/types').SongService} SongService
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 */

import { safeParse } from 'valibot';
import ValibotError from '../../errors/valibot.mjs';
import { AlbumPayloadSchema } from './schema.mjs';

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
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async post(req, h) {
    const parseResult = safeParse(AlbumPayloadSchema, req.payload, { abortEarly: true });
    if (!parseResult.success) throw new ValibotError(parseResult.issues, 400);

    const albumId = await this.#service.create(parseResult.output);

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
    const parseResult = safeParse(AlbumPayloadSchema, req.payload, { abortEarly: false });
    if (!parseResult.success) throw new ValibotError(parseResult.issues, 400);

    await this.#service.update({ ...parseResult.output, id: albumId });

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
}
