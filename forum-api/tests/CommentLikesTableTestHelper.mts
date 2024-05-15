import pool from '../src/infrastructures/database/postgres/pool.mjs';

const CommentLikesTableTestHelper = {
  async add({
    id = 'comment-like-123',
    commentId = 'comment-123',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3) RETURNING *',
      values: [id, commentId, userId],
    };

    const { rows } = await pool.query(query);

    return rows[0];
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE comment_likes CASCADE');
  },
};

export default CommentLikesTableTestHelper;
