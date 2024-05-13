import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';

export default class CommentLikesHandler {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  async put(request: Request, h: ResponseToolkit) {
    const credential = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const action = this.#container.get('toggleCommentLikeUseCase');
    await action.execute({ threadId, commentId, userId: credential.id as string });

    return h.response({
      status: 'success',
    });
  }
}
