import AddedComment from '../AddedComment.mjs';

describe('AddedComment entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error
    expect(() => new AddedComment(payload)).toThrowError(
      'COMMENT.NOT_CONTAIN_NEEDED',
    );
  });

  it('should throw error when paylod not meet data specification', () => {
    const payload = {
      id: true,
      content: 123,
      owner: 123,
    };

    // @ts-expect-error
    expect(() => new AddedComment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'content-123',
      owner: 'user-123',
    };

    // @ts-expect-error
    const comment = new AddedComment(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.owner).toEqual(payload.owner);
  });
});
