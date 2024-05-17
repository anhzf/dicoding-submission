import CommentRepository from '../../../domains/comments/CommentRepository.mjs';
import ReplyRepository from '../../../domains/replies/ReplyRepository.mjs';
import AddedReply from '../../../domains/replies/entities/AddedReply.mjs';
import InsertReply from '../../../domains/replies/entities/InsertReply.mjs';
import ThreadRepository from '../../../domains/threads/ThreadRepository.mjs';
import AddReplyUseCase from '../AddReplyUseCase.mjs';

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const credential = { id: 'user-123' };
    const useCasePayload = {
      content: 'content reply-1234',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: credential.id,
    });

    const { content, threadId, commentId } = useCasePayload;

    /** creating dependency of use case */
    // @ts-expect-error
    const mockReplyRepository = new ReplyRepository();
    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockReplyRepository.insert = vitest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReply({
        id: 'reply-123',
        content: 'content reply-1234',
        owner: 'user-123',
      })));

    mockThreadRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.isExist = vitest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const addedReply = await addReplyUseCase.execute(useCasePayload, credential);
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockThreadRepository.isExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.isExist).toBeCalledWith(commentId);
    expect(mockReplyRepository.insert).toBeCalledWith(
      new InsertReply({ content, threadId, commentId, userId: credential.id }),
    );
  });
});
