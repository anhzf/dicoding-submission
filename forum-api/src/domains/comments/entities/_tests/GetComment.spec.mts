import GetComment from '../GetComment.mjs';

describe('GetComment entities', () => {
  it('should throw error not contain property', () => {
    const payload = {
      id: 'comment-123',
    };

    // @ts-expect-error for testing purpose
    expect(() => new GetComment(payload)).toThrow(
      'COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error not meet data specification', () => {
    const payload = {
      id: 'comment-123',
      date: true,
      username: 123,
      content: ['123', true],
      deletedAt: 123,
    };

    // @ts-expect-error for testing purpose
    expect(() => new GetComment(payload)).toThrow(
      'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should not throw error', () => {
    const payload = {
      id: 'comment-123',
      content: 'lorem ipsum',
      username: 'anhzf',
      date: new Date('2021-02-10'),
      deletedAt: new Date('2021-02-11'),
    };

    const getComment = new GetComment(payload);

    expect(getComment.id).toStrictEqual(payload.id);
    expect(getComment.content).toStrictEqual(payload.content);
    expect(getComment.username).toStrictEqual(payload.username);
    expect(getComment.date).toStrictEqual(payload.date);
    expect(getComment.deletedAt).toStrictEqual(payload.deletedAt);
  });
});
