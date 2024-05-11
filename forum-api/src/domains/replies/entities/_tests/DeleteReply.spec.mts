import DeleteReply from '../DeleteReply.mjs';

describe('DeleteReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error
    expect(() => new DeleteReply(payload)).toThrowError(
      'REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data specification', () => {
    const payload = {
      id: true,
      userId: 123,
      threadId: 123,
      commentId: 123,
    };

    // @ts-expect-error
    expect(() => new DeleteReply(payload)).toThrowError(
      'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should correctly', () => {
    const payload = {
      id: 'reply-123',
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const reply = new DeleteReply(payload);

    expect(reply.id).toEqual(payload.id);
    expect(reply.userId).toEqual(payload.userId);
    expect(reply.threadId).toEqual(payload.threadId);
    expect(reply.commentId).toEqual(payload.commentId);
  });
});
