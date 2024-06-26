import InsertThread from '../InsertThread.mjs';

describe('InsertThread entities', () => {
  it('should throw error when payload not contain property ', () => {
    const payload = {};

    //   Action and assert
    // @ts-expect-error for testing purpose
    expect(() => new InsertThread(payload)).toThrow(
      'THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when data not specification', () => {
    const payload = {
      ownerId: 123,
      title: true,
      body: 12323232,
    };

    // @ts-expect-error for testing purpose
    expect(() => new InsertThread(payload)).toThrow(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should thread correctly', () => {
    const payload = {
      ownerId: 'user-123',
      title: 'lorem ipsum',
      body: 'lorem ipsum ipsum lorem',
    };

    // action
    const thread = new InsertThread(payload);

    // Assert
    expect(thread.ownerId).toEqual(payload.ownerId);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
  });
});
