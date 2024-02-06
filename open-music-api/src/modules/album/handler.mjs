/**
 * @typedef {import('./types').Album} Album
 * @typedef {import('./types').AlbumService} AlbumService
 */

export default class AlbumHandler {
  /** @type {AlbumService} */
  #service;

  /**
   * @param {AlbumService} service
   */
  constructor(service) {
    this.#service = service;
  }

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async post(request, h) {
    const { name, year, performer } = request.payload;
    const albumId = await this.#service.create({ name, year, performer });

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

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async list() {
    const albums = await this.#service.list();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async get(req) {
    const { albumId } = req.params;
    const album = await this.#service.get(albumId);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async put(req) {
    const { albumId } = req.params;
    const { name, year, performer } = req.payload;
    await this.#service.update(albumId, { name, year, performer });
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  /** @extends {import('@hapi/hapi').Lifecycle.Method} */
  async destroy(req) {
    const { albumId } = req.params;
    await this.#service.delete(albumId);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}
