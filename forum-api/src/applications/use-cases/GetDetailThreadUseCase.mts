import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import type CommentRepository from '../../domains/comments/CommentRepository.mjs';
import type ReplyRepository from '../../domains/replies/ReplyRepository.mjs';
import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';

export default class GetDetailThreadUseCase {
  #threadRepository: ThreadRepository;
  #commentRepository: CommentRepository;
  #replyRepository: ReplyRepository;

  constructor({ threadRepository, commentRepository, replyRepository }: {
    threadRepository: ThreadRepository;
    commentRepository: CommentRepository;
    replyRepository: ReplyRepository;
  }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  async execute(threadId: string) {
    const thread = await this.#threadRepository.get(threadId);
    if (!thread) throw new NotFoundError(`threadId ${threadId} tidak ditemukan`);

    const comments = await this.#commentRepository.hasThreadOf(threadId);

    const withReplies = await Promise.all(comments.map(async (comment) => ({
      ...comment,
      content: comment.deletedAt ? '**komentar telah dihapus**' : comment.content,
      replies: (await this.#replyRepository.hasCommentOf(comment.id)).map((reply) => ({
        ...reply,
        content: reply.deletedAt ? '**balasan telah dihapus**' : reply.content,
      })),
    })));

    return {
      ...thread,
      comments: withReplies,
    };
  }
}
