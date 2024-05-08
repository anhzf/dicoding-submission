import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import type CommentRepository from '../../domains/comments/CommentRepository.mjs';
import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';

export default class GetDetailThreadUseCase {
  #threadRepository: ThreadRepository;
  #commentRepository: CommentRepository;

  constructor({ threadRepository, commentRepository }: {
    threadRepository: ThreadRepository, commentRepository: CommentRepository
  }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(threadId: string) {
    const thread = await this.#threadRepository.get(threadId);
    if (!thread) throw new NotFoundError(`threadId ${threadId} tidak ditemukan`);

    const comments = await this.#commentRepository.hasThreadOf(threadId);

    return {
      ...thread,
      comments: comments.map(({ deletedAt, content, ...comment }) => ({
        ...comment,
        content: deletedAt ? '**komentar telah dihapus**' : content,
      })),
    };
  }
}
