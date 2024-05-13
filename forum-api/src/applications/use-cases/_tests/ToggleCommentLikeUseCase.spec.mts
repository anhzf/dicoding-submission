import CommentLikeRepository from '../../../domains/commentLikes/CommentLikeRepository.mjs';
import CommentLike from '../../../domains/commentLikes/entities/CommentLike.mjs';
import SetCommentLike from '../../../domains/commentLikes/entities/SetCommentLike.mjs';
import ToggleCommentLikeUseCase from '../ToggleCommentLikeUseCase.mjs';

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrating the toggle comment like action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
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
    // @ts-expect-error
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockCommentLikeRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.set = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
    });

    // action
    const result = toggleCommentLikeUseCase.execute(useCasePayload);

    await expect(result).resolves.not.toThrowError();
    expect(mockCommentLikeRepository.isExist).toBeCalledWith(commentLike);
    expect(mockCommentLikeRepository.set).toBeCalledWith(setCommentLike);
  });

  it('should orchestrating the toggle comment unlike action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
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
    // @ts-expect-error
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockCommentLikeRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.unset = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentLikeRepository: mockCommentLikeRepository,
    });

    // action
    const result = toggleCommentLikeUseCase.execute(useCasePayload);

    await expect(result).resolves.not.toThrowError();
    expect(mockCommentLikeRepository.isExist).toBeCalledWith(commentLike);
    expect(mockCommentLikeRepository.unset).toBeCalledWith(setCommentLike);
  });
});

