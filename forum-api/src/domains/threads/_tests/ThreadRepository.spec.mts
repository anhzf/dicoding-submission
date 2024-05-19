import ThreadRepository from '../ThreadRepository.mjs';

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    // @ts-expect-error for testing purpose
    const threadRepository = new ThreadRepository();
    // Action and Assert
    expect(threadRepository.insert).toBeUndefined();
    expect(threadRepository.get).toBeUndefined();
    expect(threadRepository.isExist).toBeUndefined();
  });
});
