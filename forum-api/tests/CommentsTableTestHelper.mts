import pool from '../src/infrastructures/database/postgres/pool.mjs';

const add = async ({
  id = 'comment-123',
  content = 'lorem ipsum',
  threadId = 'thread-123',
  owner = 'user-123',
}) => {
  const query = {
    text: 'INSERT INTO threads_comments (id, content, thread_id, owner) VALUES ($1, $2, $3, $4)',
    values: [id, content, threadId, owner],
  };
  await pool.query(query);
};

const get = async (id: string) => {
  const query = {
    text: 'SELECT * FROM threads_comments where id = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const clean = async () => {
  await pool.query('DELETE FROM threads_comments WHERE 1=1');
};

const CommentsTableTestHelper = {
  add,
  get,
  clean,
};

export default CommentsTableTestHelper;
