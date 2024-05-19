import AddedComment from '../AddedComment.mjs';

describe('AddedComment entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error for testing purpose
    expect(() => new AddedComment(payload)).toThrow(
      'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when paylod not meet data specification', () => {
    const payload = {
      id: true,
      content: 123,
      ownerId: 123,
    };

    // @ts-expect-error for testing purpose
    expect(() => new AddedComment(payload)).toThrow(
      'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'content-123',
      ownerId: 'user-123',
    };

    const comment = new AddedComment(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.content).toEqual(payload.content);
    expect(comment.ownerId).toEqual(payload.ownerId);
  });
});
