import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';

export default class CommentLikesHandler {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  async put(request: Request, h: ResponseToolkit) {
    const credential = request.auth.credentials;
    const { commentId } = request.params;

    const likeComment = this.#container.get('toggleCommentLikeUseCase');
    await likeComment.execute({ commentId, userId: credential.id as string });

    return {
      status: 'success',
    };
  }
}
