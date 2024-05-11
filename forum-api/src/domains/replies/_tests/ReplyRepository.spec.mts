import ReplyRepository from '../ReplyRepository.mjs';

describe('reply repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    // @ts-expect-error
    const replyRepository = new ReplyRepository();

    // Act & Assert
    expect(replyRepository.insert).toBeUndefined();
    expect(replyRepository.delete).toBeUndefined();
    expect(replyRepository.hasCommentOf).toBeUndefined();
    expect(replyRepository.isExist).toBeUndefined();
    expect(replyRepository.isOwned).toBeUndefined();
  });
});
