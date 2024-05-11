import pool from '../src/infrastructures/database/postgres/pool.mjs';

const UsersTableTestHelper = {
  async add({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING *',
      values: [id, username, password, fullname],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async get(id: string) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE users CASCADE');
  },
};

export default UsersTableTestHelper;
