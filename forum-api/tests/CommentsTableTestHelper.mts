import pool from '../src/infrastructures/database/postgres/pool.mjs';

const CommentsTableTestHelper = {
  async add({
    id = 'comment-123',
    content = 'lorem ipsum',
    threadId = 'thread-123',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [id, content, threadId, userId],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async get(id: string) {
    const query = {
      text: 'SELECT * FROM comments where id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE comments CASCADE');
  },
};

export default CommentsTableTestHelper;
