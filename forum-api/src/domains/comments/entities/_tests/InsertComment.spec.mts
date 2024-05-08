import InsertComment from '../InsertComment.mjs';

describe('InsertComment Entities', () => {
  it('should throw error when payload not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error
    expect(() => new InsertComment(payload)).toThrowError(
      'INSERT_COMMENT.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when payload not meet data specification ', () => {
    // Arrange
    const payload = {
      content: true,
      threadId: 232,
      ownerId: 123,
    };

    // @ts-expect-error
    expect(() => new InsertComment(payload)).toThrowError(
      'INSERT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should correctly ', () => {
    // Arrange
    const payload = {
      content: 'comment-123',
      threadId: 'thread-123',
      ownerId: 'user-123',
    };

    const comment = new InsertComment(payload);

    expect(comment.content).toEqual(payload.content);
    expect(comment.threadId).toEqual(payload.threadId);
    expect(comment.ownerId).toEqual(payload.ownerId);
  });
});
