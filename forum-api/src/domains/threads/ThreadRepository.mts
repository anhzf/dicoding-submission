import type AddedThread from './entities/AddedThread.mjs';
import type DetailThread from './entities/DetailThread.mjs';
import type InsertThread from './entities/InsertThread.mjs';

export default abstract class ThreadRepository {
  abstract insert(payload: InsertThread): Promise<AddedThread>;

  abstract get(id: string): Promise<DetailThread>;

  abstract isExist(id: string): Promise<boolean>;
}
