import CommentRepository from '../../../domains/comments/CommentRepository.mjs';
import GetComment from '../../../domains/comments/entities/GetComment.mjs';
import ReplyRepository from '../../../domains/replies/ReplyRepository.mjs';
import ThreadRepository from '../../../domains/threads/ThreadRepository.mjs';
import DetailThread from '../../../domains/threads/entities/DetailThread.mjs';
import GetDetailThreadUseCase from '../GetDetailThreadUseCase.mjs';

describe('GetDetailThreadUseCase interface', () => {
  it('should orchestrating the get detail thread correctly', async () => {
    const threadId = 'thread-123';
    const firstCommentId = 'comment-12332323';
    const secondCommentId = 'comment-12523232';
    const expectedDetailThread = {
      id: threadId,
      username: 'anhzf',
      title: 'Judul',
      body: 'Body thread',
      date: new Date('2021-01-01'),
      comments: [
        {
          id: firstCommentId,
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment',
        },
        {
          id: secondCommentId,
          username: 'dicoding',
          date: new Date('2021-08-08T07:26:21.338Z'),
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // @ts-expect-error
    const mockThreadRepository = new ThreadRepository();
    // @ts-expect-error
    const mockCommentRepository = new CommentRepository();
    // @ts-expect-error
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.get = vitest.fn()
      .mockImplementation(() => Promise.resolve(
        new DetailThread({
          id: threadId,
          title: 'Judul',
          body: 'Body thread',
          username: 'anhzf',
          date: new Date('2021-01-01'),
        }),
      ));

    mockCommentRepository.hasThreadOf = vitest.fn()
      .mockImplementation(() => Promise.resolve([
        new GetComment({
          id: firstCommentId,
          username: 'johndoe',
          date: new Date('2021-08-08T07:22:33.555Z'),
          content: 'sebuah comment',
          deletedAt: null,
        }),
        new GetComment({
          id: secondCommentId,
          username: 'dicoding',
          date: new Date('2021-08-08T07:26:21.338Z'),
          content: 'content comment',
          deletedAt: new Date('2021-08-08T07:26:21.338Z'),
        }),
      ]));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threads = await getDetailThreadUseCase.execute(threadId);
    expect(mockThreadRepository.get).toBeCalledWith(threadId);
    expect(mockCommentRepository.hasThreadOf).toBeCalledWith(threadId);

    expect(threads.id).toEqual(expectedDetailThread.id);
    expect(threads.username).toEqual(expectedDetailThread.username);
    expect(threads.title).toEqual(expectedDetailThread.title);
    expect(threads.body).toEqual(expectedDetailThread.body);
    expect(threads.date).toBeDefined();
    expect(threads.comments).toHaveLength(2);
    expect(threads).toEqual(expectedDetailThread);
    expect(threads.comments[0]).toHaveProperty('id');
    expect(threads.comments[0]).toHaveProperty('username');
    expect(threads.comments[0]).toHaveProperty('date');
    expect(threads.comments[0]).toHaveProperty('content');
  });
});
