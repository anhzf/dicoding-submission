import type { Pool } from 'pg';
import CommentLikeRepository from '../../domains/commentLikes/CommentLikeRepository.mjs';
import type CommentLike from '../../domains/commentLikes/entities/CommentLike.mjs';
import type SetCommentLike from '../../domains/commentLikes/entities/SetCommentLike.mjs';
import GetCommentLikesCount from '../../domains/commentLikes/entities/GetCommentLikesCount.mjs';

export default class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  #pool: Pool;
  #idGenerator: () => string;

  constructor(pool: Pool, idGenerator: () => string) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async isExist(commentLike: CommentLike) {
    const query = {
      text: 'SELECT comment_id from comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentLike.commentId, commentLike.userId],
    };

    const { rowCount } = await this.#pool.query(query);

    return !!rowCount;
  }

  async set(commentLike: SetCommentLike) {
    const id = `comment-like-${this.#idGenerator()}`;
    const query = {
      text: 'INSERT INTO comment_likes (id, comment_id, user_id) VALUES($1, $2, $3)',
      values: [id, commentLike.commentId, commentLike.userId],
    };

    await this.#pool.query(query);
  }

  async unset(commentLike: SetCommentLike) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentLike.commentId, commentLike.userId],
    };

    await this.#pool.query(query);
  }

  async countByComment(commentId: string) {
    const query = {
      text: 'SELECT COUNT(id) FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const { rows } = await this.#pool.query(query);

    return new GetCommentLikesCount({
      commentId,
      count: parseInt(rows[0].count, 10),
    });
  }
}
