import InsertReply from '../InsertReply.mjs';

describe('InsertReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error
    expect(() => new InsertReply(payload)).toThrowError(
      'REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data specification', () => {
    const payload = {
      content: 123,
      userId: 123,
      threadId: 123,
      commentId: 123,
    };

    // @ts-expect-error
    expect(() => new InsertReply(payload)).toThrowError(
      'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should correctly', () => {
    const payload = {
      content: 'content-123',
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const reply = new InsertReply(payload);

    expect(reply.content).toEqual(payload.content);
    expect(reply.userId).toEqual(payload.userId);
    expect(reply.threadId).toEqual(payload.threadId);
    expect(reply.commentId).toEqual(payload.commentId);
  });
});
