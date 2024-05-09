import pool from '../src/infrastructures/database/postgres/pool.mjs';

const add = async ({
  id = 'comment-123',
  content = 'lorem ipsum',
  threadId = 'thread-123',
  owner = 'user-123',
  currentDate = new Date().toISOString(),
}) => {
  const query = {
    text: 'INSERT INTO comments VALUES ($1,$2,$3,$4,$5)',
    values: [id, content, threadId, owner, currentDate],
  };
  await pool.query(query);
};

const get = async (id: string) => {
  const query = {
    text: 'SELECT * FROM comments where id = $1',
    values: [id],
  };

  const result = await pool.query(query);
  return result.rows;
};

const clean = async () => {
  await pool.query('DELETE FROM comments WHERE 1=1');
};

const CommentsTableTestHelper = {
  add,
  get,
  clean,
};

export default CommentsTableTestHelper;
