import type CommentRepository from '../../domains/comments/CommentRepository.mjs';
import InsertComment from '../../domains/comments/entities/InsertComment.mjs';
import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';

export default class AddCommentUseCase {
  #commentRepository: CommentRepository;
  #threadRepository: ThreadRepository;

  constructor({ commentRepository, threadRepository }: {
    commentRepository: CommentRepository, threadRepository: ThreadRepository,
  }) {
    this.#commentRepository = commentRepository;
    this.#threadRepository = threadRepository;
  }

  async execute(useCasePayload: Omit<InsertComment, never>) {
    const { content, threadId, ownerId } = useCasePayload;
    await this.#threadRepository.isExist(threadId);
    const newComment = new InsertComment({ content, threadId, ownerId });
    return this.#commentRepository.insert(newComment);
  }
}
