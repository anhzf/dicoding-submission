import NotFoundError from '../../../commons/exceptions/NotFoundError.mjs';
import CommentLikeRepository from '../../../domains/commentLikes/CommentLikeRepository.mjs';
import CommentLike from '../../../domains/commentLikes/entities/CommentLike.mjs';
import SetCommentLike from '../../../domains/commentLikes/entities/SetCommentLike.mjs';
import CommentRepository from '../../../domains/comments/CommentRepository.mjs';
import ThreadRepository from '../../../domains/threads/ThreadRepository.mjs';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.mjs';

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrating the toggle comment like action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: credential.id,
    };

    const setCommentLike = new SetCommentLike({
      commentId: useCasePayload.commentId,
      userId: credential.id,
    });

    const commentLike = new CommentLike({
      commentId: useCasePayload.commentId,
      userId: credential.id,
    });

    /** creating dependency of use case */
    // @ts-expect-error for testing purpose
    const mockCommentLikeRepository = new CommentLikeRepository();
    // @ts-expect-error for testing purpose
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error for testing purpose
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentLikeRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('comment like not found')));

    mockCommentLikeRepository.set = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentLikeRepository.unset = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const result = toggleCommentLikeUseCase.execute(useCasePayload);

    await expect(result).resolves.not.toThrow();
    expect(mockCommentLikeRepository.isExist).toBeCalledWith(commentLike);
    expect(mockCommentLikeRepository.unset).not.toBeCalled();
    expect(mockCommentLikeRepository.set).toBeCalledWith(setCommentLike);
    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
  });

  it('should orchestrating the toggle comment unlike action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: credential.id,
    };

    const setCommentLike = new SetCommentLike({
      commentId: useCasePayload.commentId,
      userId: credential.id,
    });

    const commentLike = new CommentLike({
      commentId: useCasePayload.commentId,
      userId: credential.id,
    });

    /** creating dependency of use case */
    // @ts-expect-error for testing purpose
    const mockCommentLikeRepository = new CommentLikeRepository();
    // @ts-expect-error for testing purpose
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error for testing purpose
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentLikeRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.unset = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const result = toggleCommentLikeUseCase.execute(useCasePayload);

    await expect(result).resolves.not.toThrow();
    expect(mockCommentLikeRepository.isExist).toBeCalledWith(commentLike);
    expect(mockCommentLikeRepository.unset).toBeCalledWith(setCommentLike);
    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
  });

  it('should throw error when thread not found', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: credential.id,
    };

    /** creating dependency of use case */
    // @ts-expect-error for testing purpose
    const mockCommentLikeRepository = new CommentLikeRepository();
    // @ts-expect-error for testing purpose
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error for testing purpose
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('thread not found')));

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const result = toggleCommentLikeUseCase.execute(useCasePayload);

    await expect(result).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
  });

  it('should throw error when comment not found', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: credential.id,
    };

    /** creating dependency of use case */
    // @ts-expect-error for testing purpose
    const mockCommentLikeRepository = new CommentLikeRepository();
    // @ts-expect-error for testing purpose
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error for testing purpose
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('comment not found')));

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const result = toggleCommentLikeUseCase.execute(useCasePayload);

    await expect(result).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
  });

  it('should throws generic error when repository error occured', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: credential.id,
    };

    /** creating dependency of use case */
    // @ts-expect-error for testing purpose
    const mockCommentLikeRepository = new CommentLikeRepository();
    // @ts-expect-error for testing purpose
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error for testing purpose
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.reject(new Error('unexpected error')));
    mockCommentLikeRepository.set = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.unset = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const result = toggleCommentLikeUseCase.execute(useCasePayload);

    await expect(result).rejects.toThrow();
    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentLikeRepository.isExist).toBeCalled();
    expect(mockCommentLikeRepository.set).not.toBeCalled();
    expect(mockCommentLikeRepository.unset).not.toBeCalled();
  });
});

