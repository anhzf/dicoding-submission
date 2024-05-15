import type { Pool } from 'pg';
import AuthorizationError from '../../commons/exceptions/AuthorizationError.mjs';
import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import CommentRepository from '../../domains/comments/CommentRepository.mjs';
import AddedComment from '../../domains/comments/entities/AddedComment.mjs';
import type DeleteComment from '../../domains/comments/entities/DeleteComment.mjs';
import GetComment from '../../domains/comments/entities/GetComment.mjs';
import type InsertComment from '../../domains/comments/entities/InsertComment.mjs';

export default class CommentRepositoryPostgres extends CommentRepository {
  #pool: Pool;
  #idGenerator: () => string;

  constructor(pool: Pool, idGenerator: () => string) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async insert(payload: InsertComment) {
    const id = `comment-${this.#idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments (id, thread_id, user_id, content) VALUES($1, $2, $3, $4) RETURNING id, thread_id, content, user_id',
      values: [
        id,
        payload.threadId,
        payload.ownerId,
        payload.content,
      ],
    };

    const { rows } = await this.#pool.query(query);

    const data = {
      threadId: rows[0].thread_id,

      ...rows[0],
    };

    return new AddedComment({
      id: data.id,
      content: data.content,
      ownerId: data.user_id,
    });
  }

  async isExist(commentId: string): Promise<void> {
    const query = {
      text: 'SELECT id from comments WHERE id = $1',
      values: [commentId],
    };

    const { rowCount } = await this.#pool.query(query);

    if (!rowCount) throw new NotFoundError('comment not found');
    ;
  }

  async isOwned(commentId: string, ownerId: string) {
    const query = {
      text: 'SELECT id from comments WHERE user_id = $1 AND id = $2',
      values: [ownerId, commentId],
    };

    const { rowCount } = await this.#pool.query(query);

    if (!rowCount) throw new AuthorizationError('You are not authorized to do an action to this comment');
  }

  async destroy({ commentId }: DeleteComment) {
    const query = {
      text: 'UPDATE comments SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      values: [commentId],
    };

    await this.#pool.query(query);
  }

  async hasThreadOf(threadId: string) {
    const query = {
      text: `SELECT comments.*, users.username
      FROM comments LEFT JOIN users ON users.id = comments.user_id
      WHERE comments.thread_id = $1
      ORDER BY date ASC`,
      values: [threadId],
    };

    const { rows } = await this.#pool.query(query);

    return rows.map((item) => new GetComment({
      ...item,
      deletedAt: item.deleted_at,
    }));
  }
}
