import CommentLikeRepository from '../CommentLikeRepository.mjs';

describe('comment like repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    // @ts-expect-error commentLikeRepository cannot be instantiated
    const commentLikeRepository = new CommentLikeRepository();

    // Act & Assert
    expect(commentLikeRepository.set).toBeUndefined();
    expect(commentLikeRepository.unset).toBeUndefined();
    expect(commentLikeRepository.isExist).toBeUndefined();
    expect(commentLikeRepository.countByComment).toBeUndefined();
  });
});
