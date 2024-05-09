import AddedThread from '../AddedThread.mjs';

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed', () => {
    const payload = {
      id: 'thread-123',
    };

    // Action and assert
    // @ts-expect-error
    expect(() => new AddedThread(payload)).toThrowError(
      'THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet specification', () => {
    const payload = {
      id: true,
      title: 122,
      owner: 123,
    };
    // @ts-expect-error
    expect(() => new AddedThread(payload)).toThrowError(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should addThread correctly', () => {
    const payload = {
      id: 'thread-12',
      title: 'lorep ipsum ipsum',
      owner: 'user-134',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
