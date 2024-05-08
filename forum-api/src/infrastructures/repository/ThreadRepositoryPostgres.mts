import type { Pool } from 'pg';
import ThreadRepository from '../../domains/threads/ThreadRepository.mjs';
import AddedThread from '../../domains/threads/entities/AddedThread.mjs';
import DetailThread from '../../domains/threads/entities/DetailThread.mjs';
import type InsertThread from '../../domains/threads/entities/InsertThread.mjs';

export default class ThreadRepositoryPostgres extends ThreadRepository {
  #pool: Pool;
  #idGenerator: () => string;

  constructor(pool: Pool, idGenerator: () => string) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async insert(payload: InsertThread) {
    const id = `thread-${this.#idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO threads VALUES($1,$2,$3,$4,$5) RETURNING id, title, body, owner',
      values: [id, payload.title, payload.body, payload.ownerId, date],
    };

    const result = await this.#pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async isExist(threadId: string) {
    const query = {
      text: 'SELECT threads.* FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this.#pool.query(query);

    return !!result.rowCount;
  }

  async get(threadId: string) {
    const query = {
      text: `SELECT
      threads.id,
      username,
      title,
      body,
      date
     FROM threads
     JOIN users ON threads.owner = users.id
     WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this.#pool.query(query);
    return new DetailThread({ ...result.rows[0] });
  }
}
