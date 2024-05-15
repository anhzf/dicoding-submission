import AuthorizationError from '../../../commons/exceptions/AuthorizationError.mjs';
import NotFoundError from '../../../commons/exceptions/NotFoundError.mjs';
import CommentRepository from '../../../domains/comments/CommentRepository.mjs';
import ReplyRepository from '../../../domains/replies/ReplyRepository.mjs';
import DeleteReply from '../../../domains/replies/entities/DeleteReply.mjs';
import ThreadRepository from '../../../domains/threads/ThreadRepository.mjs';
import DeleteReplyUseCase from '../DeleteReplyUseCase.mjs';

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      id: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    // @ts-expect-error
    const mockReplyRepository = new ReplyRepository();
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockReplyRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.isOwned = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.delete = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    await deleteReplyUseCase.execute(useCasePayload, credential);
    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.isExist).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.isOwned).toBeCalledWith(useCasePayload.id, credential.id);
    expect(mockReplyRepository.delete).toBeCalledWith(
      new DeleteReply({ ...useCasePayload, userId: credential.id }),
    );
  });

  it('should throw error when thread not found', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      id: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    // @ts-expect-error
    const mockReplyRepository = new ReplyRepository();
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('thread not found')));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action & assert
    await expect(deleteReplyUseCase.execute(useCasePayload, credential))
      .rejects.toThrow(NotFoundError);

    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
  });

  it('should throw error when comment not found', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      id: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    // @ts-expect-error
    const mockReplyRepository = new ReplyRepository();
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('comment not found')));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action & assert
    await expect(deleteReplyUseCase.execute(useCasePayload, credential))
      .rejects.toThrow(NotFoundError);

    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
  });

  it('should throw error when reply not found', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      id: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    // @ts-expect-error
    const mockReplyRepository = new ReplyRepository();
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError('reply not found')));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action & assert
    await expect(deleteReplyUseCase.execute(useCasePayload, credential))
      .rejects.toThrow(NotFoundError);

    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.isExist).toBeCalledWith(useCasePayload.id);
  });

  it('should throw error when user not authorized to delete reply', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      id: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    // @ts-expect-error
    const mockReplyRepository = new ReplyRepository();
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.isOwned = vitest.fn()
      .mockImplementation(() => Promise.reject(new AuthorizationError('you are not authorized')));

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action & assert
    await expect(deleteReplyUseCase.execute(useCasePayload, credential))
      .rejects.toThrow(AuthorizationError);

    expect(mockThreadRepository.isExist).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.isExist).toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.isOwned).toBeCalledWith(useCasePayload.id, credential.id);
  });
});
