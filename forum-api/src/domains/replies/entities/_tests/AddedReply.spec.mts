import AddedReply from '../AddedReply.mjs';

describe('AddedReply entities', () => {
  it('should throw error when paylod not contain property', () => {
    //   Arrange
    const payload = {};

    // Action and assert
    // @ts-expect-error
    expect(() => new AddedReply(payload)).toThrow(
      'REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data specification', () => {
    const payload = {
      id: true,
      content: 123,
      owner: 123,
    };

    // @ts-expect-error
    expect(() => new AddedReply(payload)).toThrow(
      'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'content-123',
      owner: 'user-123',
    };

    const reply = new AddedReply(payload);

    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.owner).toEqual(payload.owner);
  });
});
