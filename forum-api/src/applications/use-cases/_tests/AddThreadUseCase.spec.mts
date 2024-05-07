import ThreadRepository from '../../../domains/threads/ThreadRepository.mjs';
import AddedThread from '../../../domains/threads/entities/AddedThread.mjs';
import InsertThread from '../../../domains/threads/entities/InsertThread.mjs';
import AddThreadUseCase from '../AddThreadUseCase.mjs';

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    //   Arrange
    const useCasePayload = {
      title: 'New Thread',
      body: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    };
    const credential = { id: 'user-123' };

    const expectedAddThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: credential.id,
    });

    const { owner, title } = expectedAddThread;
    const { body } = useCasePayload;

    /** creating dependency of use case */
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.insert = vitest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: 'New Thread',
        owner: 'user-123',
      })));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadRepository = await getThreadUseCase.execute(
      useCasePayload,
      credential,
    );

    // Assert
    expect(threadRepository).toStrictEqual(expectedAddThread);
    expect(mockThreadRepository.insert).toBeCalledWith(
      new InsertThread({ ownerId: owner, title, body }),
    );
  });
});
