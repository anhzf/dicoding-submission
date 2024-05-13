import GetCommentLikesCount from '../GetCommentLikesCount.mjs';

describe('GetCommentLikesCount entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error
    expect(() => new GetCommentLikesCount(payload)).toThrowError(
      'COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data specification', () => {
    const payload = {
      commentId: 'comment-123',
      count: '123',
    };

    // @ts-expect-error
    expect(() => new GetCommentLikesCount(payload)).toThrowError(
      'COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should correctly', () => {
    const payload = {
      commentId: 'comment-123',
      count: 123,
    };

    const getCommentLikesCount = new GetCommentLikesCount(payload);

    expect(getCommentLikesCount.count).toEqual(payload.count);
  });
});
