import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';

export default class RepliesHandler {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  async post(request: Request, h: ResponseToolkit) {
    const credential = request.auth.credentials;
    const { threadId, commentId } = request.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { content } = request.payload as any;

    const action = this.#container.get('addReplyUseCase');
    const addedReply = await action.execute({
      threadId,
      commentId,
      content,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, credential as any);

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    })
      .code(201);
  }

  async destroy(request: Request, h: ResponseToolkit) {
    const credential = request.auth.credentials;
    const { replyId, threadId, commentId } = request.params;

    const action = this.#container.get('deleteReplyUseCase');
    await action.execute({
      id: replyId,
      threadId,
      commentId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, credential as any);

    return h.response({
      status: 'success',
    });
  }
}
