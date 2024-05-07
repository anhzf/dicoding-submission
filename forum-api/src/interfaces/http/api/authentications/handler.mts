import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';

export default class AuthenticationsHandler {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  async post(request: Request, h: ResponseToolkit) {
    const loginUserUseCase = this.#container.get('loginUserUseCase');
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload as any);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async put(request: Request) {
    const refreshAuthenticationUseCase = this.#container.get('refreshAuthenticationUseCase');
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload as any);
    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async destroy(request: Request) {
    const logoutUserUseCase = this.#container.get('logoutUserUseCase');
    await logoutUserUseCase.execute(request.payload as any);
    return {
      status: 'success',
    };
  }
}
