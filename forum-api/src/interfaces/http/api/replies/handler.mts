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
    const { content } = request.payload as any;

    const action = this.#container.get('addReplyUseCase');
    const addedReply = await action.execute({
      threadId,
      commentId,
      content,
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
    }, credential as any);

    return h.response({
      status: 'success',
    });
  }
}
