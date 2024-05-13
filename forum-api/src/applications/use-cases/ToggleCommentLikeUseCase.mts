import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import type CommentLikeRepository from '../../domains/commentLikes/CommentLikeRepository.mjs';
import CommentLike from '../../domains/commentLikes/entities/CommentLike.mjs';
import SetCommentLike from '../../domains/commentLikes/entities/SetCommentLike.mjs';
import type CommentRepository from '../../domains/comments/CommentRepository.mjs';
import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';

export default class ToggleCommentLikeUseCase {
  #commentLikeRepository: CommentLikeRepository;
  #threadRepository: ThreadRepository;
  #commentRepository: CommentRepository;

  constructor({ commentLikeRepository, threadRepository, commentRepository }: {
    commentLikeRepository: CommentLikeRepository,
    threadRepository: ThreadRepository,
    commentRepository: CommentRepository,
  }) {
    this.#commentLikeRepository = commentLikeRepository;
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(useCasePayload: Omit<SetCommentLike, never> & { threadId: string }) {
    const { threadId, commentId, userId } = useCasePayload;
    const commentLike = new CommentLike({ commentId, userId });
    const setCommentLike = new SetCommentLike({ commentId, userId });

    if (!(await this.#threadRepository.isExist(threadId))) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    if (!(await this.#commentRepository.isExist(commentId))) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    if (await this.#commentLikeRepository.isExist(commentLike)) {
      return this.#commentLikeRepository.unset(setCommentLike);
    }

    return this.#commentLikeRepository.set(setCommentLike);
  }
}
