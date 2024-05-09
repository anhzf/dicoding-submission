import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';

export default class ThreadsHandler {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  async post(request: Request, h: ResponseToolkit) {
    const useCasePayload = request.payload;
    const credential = request.auth.credentials;

    const action = this.#container.get('addThreadUseCase');
    const addedThread = await action.execute(useCasePayload as any, credential as any);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async get(request: Request, h: ResponseToolkit) {
    const { threadId } = request.params;
    const getDetailThread = this.#container.get('getDetailThreadUseCase');
    const thread = await getDetailThread.execute(threadId);
    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}
