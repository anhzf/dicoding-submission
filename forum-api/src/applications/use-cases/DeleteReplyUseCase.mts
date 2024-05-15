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

    await this.#threadRepository.isExist(threadId);
    await this.#commentRepository.isExist(commentId);
    await this.#replyRepository.isExist(id);
    await this.#replyRepository.isOwned(id, credential.id);

    await this.#replyRepository.delete(new DeleteReply({
      ...useCasePayload,
      userId: credential.id,
    }));
  }
}
