import pool from '../src/infrastructures/database/postgres/pool.mjs';

const AuthenticationsTableTestHelper = {
  async add(token: string) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1) RETURNING *',
      values: [token],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async get(token: string) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE authentications');
  },
};

export default AuthenticationsTableTestHelper;
