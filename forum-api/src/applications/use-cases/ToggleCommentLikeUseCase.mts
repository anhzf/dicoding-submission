import type CommentLikeRepository from '../../domains/commentLikes/CommentLikeRepository.mjs';
import CommentLike from '../../domains/commentLikes/entities/CommentLike.mjs';
import SetCommentLike from '../../domains/commentLikes/entities/SetCommentLike.mjs';

export default class ToggleCommentLikeUseCase {
  #commentLikeRepository: CommentLikeRepository;

  constructor({ commentLikeRepository }: {
    commentLikeRepository: CommentLikeRepository,
  }) {
    this.#commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload: Omit<SetCommentLike, never>) {
    const { commentId, userId } = useCasePayload;
    const commentLike = new CommentLike({ commentId, userId });
    const setCommentLike = new SetCommentLike({ commentId, userId });

    if (await this.#commentLikeRepository.isExist(commentLike)) {
      return this.#commentLikeRepository.unset(setCommentLike);
    }

    return this.#commentLikeRepository.set(setCommentLike);
  }
}
