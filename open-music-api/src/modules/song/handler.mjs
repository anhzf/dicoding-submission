/**
 * @typedef {import('./types').Song} Song
 * @typedef {import('./types').SongDetail} SongDetail
 * @typedef {import('./types').SongService} SongService
 */

export default class SongHandler {
  /** @type {SongService} */
  #service;

  /**
   * @param {SongService} service
   */
  constructor(service) {
    this.#service = service;
  }

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async post(request, h) {
    const { name, year, performer } = request.payload;
    const songId = await this.#service.create({ name, year, performer });

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

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async list() {
    const Songs = await this.#service.list();
    return {
      status: 'success',
      data: {
        Songs,
      },
    };
  }

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async get(req) {
    const { songId } = req.params;
    const Song = await this.#service.get(songId);
    return {
      status: 'success',
      data: {
        Song,
      },
    };
  }

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async put(req) {
    const { songId } = req.params;
    const { name, year, performer } = req.payload;
    await this.#service.update(songId, { name, year, performer });
    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async destroy(req) {
    const { songId } = req.params;
    await this.#service.delete(songId);
    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}
