import pool from '../src/infrastructures/database/postgres/pool.mjs';

const CommentLikesTableTestHelper = {
  async add({
    id = 'comment-like-123',
    commentId = 'comment-123',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await pool.query(query);
  },

  async truncate() {
    await pool.query('TRUNCATE TABLE comment_likes CASCADE');
  }
};

export default CommentLikesTableTestHelper;
