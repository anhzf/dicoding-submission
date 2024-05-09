import type { Request, ResponseToolkit } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';

export default class CommentsHandler {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  async post(request: Request, h: ResponseToolkit) {
    const credential = request.auth.credentials;
    const { threadId } = request.params;

    const payload = {
      content: (request.payload as any).content,
      threadId,
      ownerId: credential.id as string,
    };
    const postComment = this.#container.get('addCommentUseCase');
    const addComment = await postComment.execute(payload);

    const addedComment = {
      id: addComment.id,
      content: addComment.content,
      owner: addComment.ownerId,
    };

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async destroy(request: Request) {
    const { threadId, commentId } = request.params;
    const { id: ownerId } = request.auth.credentials as any;

    const deleteComment = this.#container.get('deleteCommentUseCase');

    const payload = { commentId, threadId, ownerId };

    await deleteComment.execute(payload);

    return {
      status: 'success',
    };
  }
}
