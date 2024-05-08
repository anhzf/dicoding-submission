import type { Pool } from 'pg';
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
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, thread_id, owner',
      values: [
        id,
        payload.content,
        payload.threadId,
        payload.ownerId,
        date,
      ],
    };
    const result = await this.#pool.query(query);
    const data = {
      threadId: result.rows[0].thread_id,
      ...result.rows[0],
    };

    return new AddedComment(data);
  }

  async isOwned(commentId: string, ownerId: string) {
    const query = {
      text: 'SELECT id from comments WHERE owner = $1 AND id = $2',
      values: [ownerId, commentId],
    };

    const result = await this.#pool.query(query);

    return !!result.rowCount;
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
      FROM comments LEFT JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1
      ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this.#pool.query(query);
    return result.rows.map((item) => new GetComment(item));
  }
}
