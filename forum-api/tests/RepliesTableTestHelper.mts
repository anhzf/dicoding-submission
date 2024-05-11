import type { QueryConfig } from 'pg'
import pool from '../src/infrastructures/database/postgres/pool.mjs';

const RepliesTableTestHelper = {
  add: async ({
    id = 'reply-123',
    content = 'Hello, there!',
    userId = 'user-123',
    threadId = 'thread-123',
    commentId = 'comment-123',
    date = new Date(),
    deleted_at = null as Date | null
  }) => {
    const query: QueryConfig = {
      text: `INSERT INTO replies (id, content, user_id, thread_id, comment_id, date, deleted_at)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      values: [id, content, userId, threadId, commentId, date, deleted_at],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  get: async (id: string) => {
    const query: QueryConfig = {
      text: 'SELECT * FROM replies WHERE id = $1 LIMIT 1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  truncate: async () => {
    await pool.query('TRUNCATE TABLE replies');
  },
};

export default RepliesTableTestHelper;
