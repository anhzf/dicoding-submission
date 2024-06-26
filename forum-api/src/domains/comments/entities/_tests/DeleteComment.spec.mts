import DeleteComment from '../DeleteComment.mjs';

describe('DeleteComment entities', () => {
  it('should throw error when payload not contain property', () => {
    const payload = {
      threadId: 'thread-124',
      commentId: '',
    };

    // @ts-expect-error for testing purpose
    expect(() => new DeleteComment(payload)).toThrow(
      'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data specifications', () => {
    const payload = {
      threadId: 'thread-124',
      commentId: 'comment-123',
      ownerId: true,
    };

    // @ts-expect-error for testing purpose
    expect(() => new DeleteComment(payload)).toThrow(
      'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when payload not meet data specifications', () => {
    const payload = {
      threadId: 'thread-124',
      commentId: 'comment-123',
      ownerId: 'user-123',
    };

    const comment = new DeleteComment(payload);

    expect(comment.threadId).toEqual(payload.threadId);
    expect(comment.commentId).toEqual(payload.commentId);
    expect(comment.ownerId).toEqual(payload.ownerId);
  });
});
