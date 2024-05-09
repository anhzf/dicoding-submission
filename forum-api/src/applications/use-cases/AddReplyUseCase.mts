import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import type CommentRepository from '../../domains/comments/CommentRepository.mjs';
import type ReplyRepository from '../../domains/replies/ReplyRepository.mjs';
import InsertReply from '../../domains/replies/entities/InsertReply.mjs';
import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';

export default class AddReplyUseCase {
  #replyRepository: ReplyRepository;
  #threadRepository: ThreadRepository;
  #commentRepository: CommentRepository;

  constructor({ replyRepository, threadRepository, commentRepository }: {
    replyRepository: ReplyRepository;
    threadRepository: ThreadRepository;
    commentRepository: CommentRepository;
  }) {
    this.#replyRepository = replyRepository;
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(useCasePayload: Omit<InsertReply, 'userId'>, credential: AuthenticatedUser) {
    const { threadId, commentId, content } = useCasePayload;

    if (!(await this.#threadRepository.isExist(threadId))) {
      throw new NotFoundError('thread not found');
    }

    if (!(await this.#commentRepository.isExist(commentId))) {
      throw new NotFoundError('comment not found');
    }

    return this.#replyRepository.insert(new InsertReply({
      userId: credential.id,
      threadId,
      commentId,
      content,
    }));
  }
}
