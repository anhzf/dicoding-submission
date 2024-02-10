import Validator from './validator.mjs';

/**
 * @typedef {import('../messaging/types').MessagingService} MessagingService
 * @typedef {import('../playlist/types').PlaylistService} PlaylistService
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 */

const MESSAGE_NAME = 'export:playlist';

export default class PlaylistExportHandler {
  /** @type {PlaylistService} */
  #playlistService;

  /** @type {MessagingService} */
  #messagingService;

  /**
   * @param {PlaylistService} playlistService
   * @param {MessagingService} messagingService
   */
  constructor(playlistService, messagingService) {
    this.#playlistService = playlistService;
    this.#messagingService = messagingService;
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async post(req, h) {
    await this.#playlistService.verifyOwner(req.params.id, req.auth.credentials.id);

    const payload = {
      ...Validator.validatePayload(req.payload),
      id: req.params.id,
    };

    await this.#messagingService.send(MESSAGE_NAME, JSON.stringify(payload));

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}
