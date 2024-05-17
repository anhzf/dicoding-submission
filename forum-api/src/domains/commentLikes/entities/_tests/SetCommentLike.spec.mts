import SetCommentLike from '../SetCommentLike.mjs';

describe('SetCommentLike entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error
    expect(() => new SetCommentLike(payload)).toThrow(
      'COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data specification', () => {
    const payload = {
      commentId: 123,
      userId: 123,
    };

    // @ts-expect-error
    expect(() => new SetCommentLike(payload)).toThrow(
      'COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should correctly', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const setCommentLike = new SetCommentLike(payload);

    expect(setCommentLike.commentId).toEqual(payload.commentId);
    expect(setCommentLike.userId).toEqual(payload.userId);
  });
});
