// @ts-check

import AuthValidator from './validator.mjs';

/**
 * @typedef {import('./types').AuthService} Service
 * @typedef {import('../user/types').UserService} UserService
 * @typedef {import('./types').AuthHandler} Handler
 * @typedef {import('@hapi/hapi').Request} HRequest
 * @typedef {import('@hapi/hapi').ResponseToolkit} HResponseToolkit
 * @typedef {import('../tokenize/index.mjs').TokenManager} TokenManager
 */

/** @implements {Handler} */
export default class AuthHandler {
  /** @type {Service} */
  #service;

  /** @type {UserService} */
  #userService;

  /** @type {TokenManager} */
  #tokenManager;

  /**
   * @param {Service} service
   * @param {{
   *  userService: UserService;
   *  tokenManager: TokenManager;
   * }} param1
   */
  constructor(service, { userService, tokenManager }) {
    this.#service = service;
    this.#userService = userService;
    this.#tokenManager = tokenManager;
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async post(req, h) {
    const { username, password } = AuthValidator.validatePostPayload(req.payload);
    const id = await this.#userService.verifyCredential(username, password);
    const accessToken = this.#tokenManager.createAccessToken({ id });
    const refreshToken = this.#tokenManager.createRefreshToken({ id });

    await this.#service.storeRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async put(req, h) {
    const { refreshToken } = AuthValidator.validatePutPayload(req.payload);
    await this.#service.verifyRefreshToken(refreshToken);

    const { id } = this.#tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this.#tokenManager.createAccessToken({ id });

    return h.response({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
  }

  /**
   * @param {HRequest} req
   * @param {HResponseToolkit} h
   */
  async destroy(req, h) {
    const { refreshToken } = AuthValidator.validateDeletePayload(req.payload);

    await this.#service.verifyRefreshToken(refreshToken);
    await this.#service.destroyRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    });
  }
}
