import NotFoundError from '../../commons/exceptions/NotFoundError.mjs';
import type CommentLikeRepository from '../../domains/commentLikes/CommentLikeRepository.mjs';
import type CommentRepository from '../../domains/comments/CommentRepository.mjs';
import type ReplyRepository from '../../domains/replies/ReplyRepository.mjs';
import type ThreadRepository from '../../domains/threads/ThreadRepository.mjs';

export default class GetDetailThreadUseCase {
  #threadRepository: ThreadRepository;
  #commentRepository: CommentRepository;
  #replyRepository: ReplyRepository;
  #commentLikeRepository: CommentLikeRepository;

  constructor({ threadRepository, commentRepository, replyRepository, commentLikeRepository }: {
    threadRepository: ThreadRepository;
    commentRepository: CommentRepository;
    replyRepository: ReplyRepository;
    commentLikeRepository: CommentLikeRepository;
  }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
    this.#commentLikeRepository = commentLikeRepository;
  }

  async execute(threadId: string) {
    const thread = await this.#threadRepository.get(threadId);

    const comments = await this.#commentRepository.hasThreadOf(threadId);

    const withReplies = await Promise.all(comments.map(async (comment) => ({
      ...comment,
      content: comment.deletedAt ? '**komentar telah dihapus**' : comment.content,
      likeCount: (await this.#commentLikeRepository.countByComment(comment.id)).count,
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
