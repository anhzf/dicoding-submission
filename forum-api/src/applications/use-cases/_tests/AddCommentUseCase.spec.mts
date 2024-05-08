import CommentRepository from '../../../domains/comments/CommentRepository.mjs';
import AddedComment from '../../../domains/comments/entities/AddedComment.mjs';
import InsertComment from '../../../domains/comments/entities/InsertComment.mjs';
import ThreadRepository from '../../../domains/threads/ThreadRepository.mjs';
import AddCommentUseCase from '../AddCommentUseCase.mjs';

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      content: 'content comment-1234',
      threadId: 'thread-123',
      ownerId: credential.id,
    };

    const expectedAddComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: credential.id,
    });

    const { content, threadId, ownerId } = useCasePayload;

    /** creating dependency of use case */
    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.insert = vitest.fn(() => Promise.resolve(new AddedComment({
      id: 'comment-123',
      content: 'content comment-1234',
      owner: 'user-123',
    })));

    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    const commentRepository = await getCommentUseCase.execute(useCasePayload);
    expect(commentRepository).toStrictEqual(expectedAddComment);
    expect(mockThreadRepository.isExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.insert).toBeCalledWith(
      new InsertComment({ content, threadId, ownerId }),
    );
  });
});
