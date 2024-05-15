import AuthorizationError from '../../../commons/exceptions/AuthorizationError.mjs';
import NotFoundError from '../../../commons/exceptions/NotFoundError.mjs';
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
    mockCommentRepository.isExist = vitest.fn()
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

  it('should throw error when thread not found', async () => {
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
      .mockImplementation(() => Promise.reject(new NotFoundError('thread not found')));

    const deleteCommentUseCase = new DeletedCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrow(NotFoundError);

    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
  });

  it('should throw error when comment not found', async () => {
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
    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('comment not found')));

    const deleteCommentUseCase = new DeletedCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrow('comment not found');

    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
  });

  it('should throw error when comment not owned', async () => {
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
    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isOwned = vitest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('you are not authorized')));

    const deleteCommentUseCase = new DeletedCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects.toThrow(AuthorizationError);

    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.isOwned).toBeCalledWith(
      useCasePayload.commentId, useCasePayload.ownerId,
    );
  });
});
