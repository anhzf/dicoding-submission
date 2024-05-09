import AuthorizationError from '../../commons/exceptions/AuthorizationError.mjs';
import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import type CommentRepository from '../../domains/comments/CommentRepository.mjs';
import DeleteComment from '../../domains/comments/entities/DeleteComment.mjs';
import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';

export default class DeleteCommentUseCase {
  #threadRepository: ThreadRepository;
  #commentRepository: CommentRepository;

  constructor({ threadRepository, commentRepository }: {
    threadRepository: ThreadRepository, commentRepository: CommentRepository,
  }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(useCasePayload: Omit<DeleteComment, never>) {
    const comment = new DeleteComment(useCasePayload);

    if (!(await this.#threadRepository.isExist(comment.threadId))) {
      throw new NotFoundError('thread not found');
    }

    if (!(await this.#commentRepository.isExist(comment.commentId))) {
      throw new NotFoundError('comment not found');
    }

    if (!(await this.#commentRepository.isOwned(comment.commentId, comment.ownerId))) {
      throw new AuthorizationError('comment not owned');
    }

    return this.#commentRepository.destroy(comment);
  }
}
