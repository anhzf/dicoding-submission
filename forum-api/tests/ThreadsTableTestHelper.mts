import pool from '../src/infrastructures/database/postgres/pool.mjs';

const ThreadsTableTestHelper = {
  async add({
    id = 'thread-123',
    title = 'lorem ipsum',
    body = 'description lorep',
    owner = 'user-124',
    currentDate = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES ($1,$2,$3,$4,$5) RETURNING *',
      values: [id, title, body, owner, currentDate],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async get(id: string) {
    const query = {
      text: 'SELECT * FROM threads WHERE id=$1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE threads CASCADE');
  },
};

export default ThreadsTableTestHelper;
