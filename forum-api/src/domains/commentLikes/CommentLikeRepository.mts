import type CommentLike from './entities/CommentLike.mjs';
import type GetCommentLikesCount from './entities/GetCommentLikesCount.mjs';
import type SetCommentLike from './entities/SetCommentLike.mjs';

export default abstract class CommentLikeRepository {
  abstract set(commentLike: SetCommentLike): Promise<void>;
  abstract unset(commentLike: SetCommentLike): Promise<void>;
  abstract isExist(commentLike: CommentLike): Promise<void>;
  abstract countByComment(commentId: string): Promise<GetCommentLikesCount>;
}
