import DetailThread from '../DetailThread.mjs';

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain', () => {
    const payload = {};
    //   Action and assert
    // @ts-expect-error for testing purpose
    expect(() => new DetailThread(payload)).toThrow(
      'THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not data specification', () => {
    const payload = {
      id: 123,
      username: true,
      title: true,
      body: 12323232,
      date: true,
      owner: true,
    };

    //   Action and assert
    // @ts-expect-error for testing purpose
    expect(() => new DetailThread(payload)).toThrow(
      'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should thread correctly', () => {
    const payload = {
      id: 'thread-123',
      username: 'anhzf',
      title: 'lorem ipsum',
      body: 'lorem ipsum ipsum lorem',
      date: new Date('2022-01-22'),
    };

    //   Action
    const thread = new DetailThread(payload);

    expect(thread.id).toEqual(payload.id);
    expect(thread.username).toEqual(payload.username);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
  });
});
