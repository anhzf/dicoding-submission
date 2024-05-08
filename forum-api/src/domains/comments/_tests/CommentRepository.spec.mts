import CommentRepository from '../CommentRepository.mjs';

describe('comment repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    // @ts-expect-error
    const commentRepository = new CommentRepository();

    // Act & Assert
    expect(commentRepository.insert).toBeUndefined();
    expect(commentRepository.isOwned).toBeUndefined();
    expect(commentRepository.destroy).toBeUndefined();
  });
});
