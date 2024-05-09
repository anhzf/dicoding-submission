import type AddedComment from './entities/AddedComment.mjs';
import type DeleteComment from './entities/DeleteComment.mjs';
import type GetComment from './entities/GetComment.mjs';
import type InsertComment from './entities/InsertComment.mjs';

export default abstract class CommentRepository {
  abstract insert(payload: InsertComment): Promise<AddedComment>;

  abstract isExist(commentId: string): Promise<boolean>;

  abstract isOwned(commentId: string, ownerId: string): Promise<boolean>;

  abstract destroy(payload: DeleteComment): Promise<void>;

  abstract hasThreadOf(threadId: string): Promise<GetComment[]>;
}
