import Validator from './validator.mjs';

/**
 * @typedef {import('./types').PlaylistCollaborationService} Service
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 * @typedef {import('../playlist/types').PlaylistService} PlaylistService
 */

export default class PlaylistCollaborationHandler {
  /** @type {Service} */
  #service;

  /** @type {PlaylistService} */
  #playlistService;

  /**
   * @param {Service} service
   * @param {PlaylistService} playlistService
   */
  constructor(service, playlistService) {
    this.#service = service;
    this.#playlistService = playlistService;
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async post(req, h) {
    const { id: owner } = req.auth.credentials;

    const payload = Validator.validatePayload(req.payload);

    await this.#playlistService.verifyOwner(payload.playlistId, owner);
    const collaborationId = await this.#service.addCollaborator(payload);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async delete(req, h) {
    const { id: owner } = req.auth.credentials;

    const payload = Validator.validatePayload(req.payload);

    await this.#playlistService.verifyOwner(payload.playlistId, owner);
    await this.#service.deleteCollaborator(payload);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
  }
}
