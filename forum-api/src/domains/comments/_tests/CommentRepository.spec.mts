import CommentRepository from '../CommentRepository.mjs';

describe('comment repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    // @ts-expect-error for testing purpose
    const commentRepository = new CommentRepository();

    // Act & Assert
    expect(commentRepository.insert).toBeUndefined();
    expect(commentRepository.isExist).toBeUndefined();
    expect(commentRepository.isOwned).toBeUndefined();
    expect(commentRepository.destroy).toBeUndefined();
    expect(commentRepository.hasThreadOf).toBeUndefined();
  });
});
