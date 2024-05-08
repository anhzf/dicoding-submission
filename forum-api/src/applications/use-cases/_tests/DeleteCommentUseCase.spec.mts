import CommentRepository from '../../../domains/comments/CommentRepository.mjs';
import ThreadRepository from '../../../domains/threads/ThreadRepository.mjs';
import DeletedCommentUseCase from '../DeleteCommentUseCase.mjs';

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      ownerId: 'user-123',
    };

    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isOwned = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.destroy = vitest.fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));

    const deleteCommentUseCase = new DeletedCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const deleteComment = await deleteCommentUseCase.execute(useCasePayload);
    expect(deleteComment).toStrictEqual({ status: 'success' });
    expect(mockThreadRepository.isExist).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.isOwned).toBeCalledWith(
      useCasePayload.commentId, useCasePayload.ownerId,
    );
    expect(mockCommentRepository.destroy).toBeCalledWith(
      useCasePayload,
    );
  });
});
