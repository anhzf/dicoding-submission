import CommentLike from '../CommentLike.mjs';

describe('CommentLike entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error
    expect(() => new CommentLike(payload)).toThrow(
      'COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data specification', () => {
    const payload = {
      commentId: 123,
      userId: 123,
    };

    // @ts-expect-error
    expect(() => new CommentLike(payload)).toThrow(
      'COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should correctly', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const commentLike = new CommentLike(payload);

    expect(commentLike.commentId).toEqual(payload.commentId);
    expect(commentLike.userId).toEqual(payload.userId);
  });
});
