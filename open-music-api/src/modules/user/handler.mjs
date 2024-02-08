import UserValidator from './validator.mjs';

/**
 * @typedef {import('./types').UserService} Service
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 */

export default class UserHandler {
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
  async signUp(req, h) {
    const payload = UserValidator.validatePayload(req.payload);
    const userId = await this.#service.register(payload);
    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    }).code(201);
  }
}
