import type { Pool, QueryConfig } from 'pg';
import ReplyRepository from '../../domains/replies/ReplyRepository.mjs';
import AddedReply from '../../domains/replies/entities/AddedReply.mjs';
import type DeleteReply from '../../domains/replies/entities/DeleteReply.mjs';
import GetReply from '../../domains/replies/entities/GetReply.mjs';
import type InsertReply from '../../domains/replies/entities/InsertReply.mjs';
import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import AuthorizationError from '../../commons/exceptions/AuthorizationError.mjs';

export default class ReplyRepositoryPostgres extends ReplyRepository {
  #pool: Pool;
  #idGenerator: () => string;

  constructor(pool: Pool, idGenerator: () => string) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async insert(reply: InsertReply): Promise<AddedReply> {
    const id = `reply-${this.#idGenerator()}`;
    const query: QueryConfig = {
      text: 'INSERT INTO replies (id, user_id, thread_id, comment_id, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [id, reply.userId, reply.threadId, reply.commentId, reply.content],
    };

    const { rows: [row] } = await this.#pool.query(query);

    return new AddedReply({
      id: row.id,
      owner: row.user_id,
      content: row.content,
    });
  }

  async delete(reply: DeleteReply): Promise<void> {
    const query: QueryConfig = {
      text: 'UPDATE replies SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      values: [reply.id],
    };

    await this.#pool.query(query);
  }

  async hasCommentOf(commentId: string): Promise<GetReply[]> {
    const query: QueryConfig = {
      text: `SELECT replies.*, users.username
      FROM replies
      JOIN users ON replies.user_id = users.id
      WHERE comment_id = $1
      ORDER BY date ASC`,
      values: [commentId],
    };

    const { rows } = await this.#pool.query(query);

    return rows.map((row) => new GetReply({
      id: row.id,
      username: row.username,
      date: row.date,
      content: row.content,
      deletedAt: row.deleted_at,
    }));
  }

  async isExist(replyId: string): Promise<void> {
    const query: QueryConfig = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this.#pool.query(query);

    if (!result.rowCount) throw new NotFoundError('reply not found');
    ;
  }

  async isOwned(replyId: string, userId: string): Promise<void> {
    const query: QueryConfig = {
      text: 'SELECT id FROM replies WHERE id = $1 AND user_id = $2',
      values: [replyId, userId],
    };
    const result = await this.#pool.query(query);

    if (!result.rowCount) throw new AuthorizationError('you are not authorized to do an action to this reply');
  }
}
