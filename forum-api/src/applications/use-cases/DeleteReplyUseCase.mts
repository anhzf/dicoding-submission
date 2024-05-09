import AuthorizationError from '../../commons/exceptions/AuthorizationError.mjs';
import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import type CommentRepository from '../../domains/comments/CommentRepository.mjs';
import type ReplyRepository from '../../domains/replies/ReplyRepository.mjs';
import DeleteReply from '../../domains/replies/entities/DeleteReply.mjs';
import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';

export default class DeleteReplyUseCase {
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

  async execute(useCasePayload: Omit<DeleteReply, 'userId'>, credential: AuthenticatedUser) {
    const { id, threadId, commentId } = useCasePayload;

    if (!(await this.#threadRepository.isExist(threadId))) {
      throw new NotFoundError('thread not found');
    }

    if (!(await this.#commentRepository.isExist(commentId))) {
      throw new NotFoundError('comment not found');
    }

    if (!(await this.#replyRepository.isExist(id))) {
      throw new NotFoundError('reply not found');
    }

    if (!(await this.#replyRepository.isOwned(id, credential.id))) {
      throw new AuthorizationError('you are not authorized to delete this reply');
    }

    await this.#replyRepository.delete(new DeleteReply({
      ...useCasePayload,
      userId: credential.id,
    }));
  }
}
