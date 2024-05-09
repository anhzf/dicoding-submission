import type { Pool, QueryConfig } from 'pg';
import ReplyRepository from '../../domains/replies/ReplyRepository.mjs';
import AddedReply from '../../domains/replies/entities/AddedReply.mjs';
import type DeleteReply from '../../domains/replies/entities/DeleteReply.mjs';
import GetReply from '../../domains/replies/entities/GetReply.mjs';
import type InsertReply from '../../domains/replies/entities/InsertReply.mjs';

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
      text: 'INSERT INTO threads_comments_replies (id, user_id, thread_id, comment_id, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
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
      text: 'UPDATE threads_comments_replies SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      values: [reply.id],
    };

    await this.#pool.query(query);
  }

  async hasCommentOf(commentId: string): Promise<GetReply[]> {
    const query: QueryConfig = {
      text: `SELECT threads_comments_replies.*, users.username
      FROM threads_comments_replies
      JOIN users ON threads_comments_replies.user_id = users.id
      WHERE comment_id = $1
      ORDER BY date ASC`,
      values: [commentId],
    };

    const { rows } = await this.#pool.query(query);

    return rows.map((row) => new GetReply({
      id: row.id,
      username: row.username,
      date: row.date,
      content: row.deleted_at ? '**balasan telah dihapus**' : row.content,
      deletedAt: row.deleted_at,
    }));
  }

  async isExist(replyId: string): Promise<boolean> {
    const query: QueryConfig = {
      text: 'SELECT id FROM threads_comments_replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this.#pool.query(query);

    return !!result.rowCount;
  }

  async isOwned(replyId: string, userId: string): Promise<boolean> {
    const query: QueryConfig = {
      text: 'SELECT id FROM threads_comments_replies WHERE id = $1 AND user_id = $2',
      values: [replyId, userId],
    };
    const result = await this.#pool.query(query);

    return !!result.rowCount;
  }
}
