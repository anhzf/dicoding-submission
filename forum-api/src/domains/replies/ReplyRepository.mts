import type AddedReply from './entities/AddedReply.mjs';
import type DeleteReply from './entities/DeleteReply.mjs';
import type GetReply from './entities/GetReply.mjs';
import type InsertReply from './entities/InsertReply.mjs';

export default abstract class ReplyRepository {
  abstract insert(reply: InsertReply): Promise<AddedReply>;
  abstract delete(reply: DeleteReply): Promise<void>;
  abstract hasCommentOf(commentId: string): Promise<GetReply[]>;
  abstract isExist(replyId: string): Promise<boolean>;
  abstract isOwned(replyId: string, userId: string): Promise<boolean>;
}
