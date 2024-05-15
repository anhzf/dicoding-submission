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

    await this.#threadRepository.isExist(comment.threadId);
    await this.#commentRepository.isExist(comment.commentId);
    await this.#commentRepository.isOwned(comment.commentId, comment.ownerId);

    return this.#commentRepository.destroy(comment);
  }
}
