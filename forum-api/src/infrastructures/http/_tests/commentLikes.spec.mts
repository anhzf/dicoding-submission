import CommentLikesTableTestHelper from '../../../../tests/CommentLikesTableTestHelper.mjs';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.mjs';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import container from '../../container.mjs';
import pool from '../../database/postgres/pool.mjs';
import createServer from '../createServer.mjs';

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterEach(async () => {
    await Promise.all([
      UsersTableTestHelper.truncate(),
      ThreadsTableTestHelper.truncate(),
      CommentsTableTestHelper.truncate(),
      CommentLikesTableTestHelper.truncate(),
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  const user = {
    username: 'anhzf',
    password: 'password',
    fullname: 'Alwan Nuha',
    accessToken: '',
  };

  beforeEach(async () => {
    const server = await createServer(container);
    // Register user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: user.username,
        password: user.password,
        fullname: user.fullname,
      },
    });

    // Login user
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: user.username,
        password: user.password,
      },
    });

    const responseJson = JSON.parse(response.payload);
    user.accessToken = responseJson.data.accessToken;
  });

  describe('when PUT', () => {
    it('should response 200 and like the comment', async () => {
      // Arrange
      const thread = {
        title: 'thread title',
        body: 'thread body',
      };
      const comment = {
        threadId: 'thread-123',
        content: 'comment content',
      };

      const server = await createServer(container);

      // Create thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: thread.title,
          body: thread.body,
        },
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const threadId = threadResponseJson.data.addedThread.id;

      // Create comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: comment.content,
        },
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const commentId = commentResponseJson.data.addedComment.id;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 and unlike the comment', async () => {
      // Arrange
      const thread = {
        title: 'thread title',
        body: 'thread body',
      };
      const comment = {
        threadId: 'thread-123',
        content: 'comment content',
      };

      const server = await createServer(container);

      // Create thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: thread.title,
          body: thread.body,
        },
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const threadId = threadResponseJson.data.addedThread.id;

      // Create comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: comment.content,
        },
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const commentId = commentResponseJson.data.addedComment.id;

      // Like comment
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      const responseJson = JSON.parse(response.payload);
      expect(responseJson.status).toEqual('success');
    });
  });
});
