import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';

export default class UsersHandler {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  async post(request: Request, h: ResponseToolkit) {
    const addUserUseCase = this.#container.get('addUserUseCase');
    const addedUser = await addUserUseCase.execute(request.payload as any);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }
}
