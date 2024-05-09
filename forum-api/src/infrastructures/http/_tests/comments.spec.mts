import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.mjs';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.mjs';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import container from '../../container.mjs';
import pool from '../../database/postgres/pool.mjs';
import createServer from '../createServer.mjs';

describe.sequential('/comments endpoint', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.clean();
    await ThreadsTableTestHelper.cleanTableThread();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const user = {
    username: 'dicoding',
    password: 'password',
    fullname: 'Dicoding Indonesia',
    accessToken: '',
  };

  beforeEach(async () => {
    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: user.username,
        password: user.password,
        fullname: user.fullname,
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: user.username,
        password: user.password,
      },
    });

    const { data } = JSON.parse(response.payload);
    user.accessToken = data?.accessToken;
  });

  describe('endpoint /threads/{threadId}/comments', () => {
    const reqBodyThread = {
      id: undefined as string | undefined,
      title: 'title thread',
      body: 'body thread',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBodyThread,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      reqBodyThread.id = responseJson.data.addedThread.id;
    });

    it('should response 201 and new thread', async () => {
      const payload = {
        content: 'body content',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(payload.content);
    });

    it('should throw error 400 when request payload not contain needed property', async () => {
      const payload = {};

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should throw error 400 when request payload not meet data type specification', async () => {
      const payload = {
        content: [123, 'lorem'],
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai',
      );
    });
  });

  describe('endpoint /threads/{threadId}/comments/{commentId}', () => {
    const threadPayload = {
      id: undefined as string | undefined,
      title: 'Title Thread',
      body: 'description thread',
    };
    const commentPayload = {
      id: undefined as string | undefined,
      content: 'Description content',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        payload: threadPayload,
      });

      const responseThreadJson = JSON.parse(threadResponse.payload);
      threadPayload.id = responseThreadJson.data.addedThread.id;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        payload: commentPayload,
      });

      const responseCommentJson = JSON.parse(commentResponse.payload);
      commentPayload.id = responseCommentJson.data.addedComment.id;
    });

    it('should throw error 401 when if not contain access token', async () => {
      const threadId = threadPayload.id;
      const commentId = commentPayload.id;

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });
      const result = await CommentsTableTestHelper.get(commentId!);
      expect(response.statusCode).toEqual(401);
      expect(result[0].deleted_at).toBeNull();
    });

    it('should response 200 and delete comment correctly', async () => {
      const threadId = threadPayload.id;
      const commentId = commentPayload.id;

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      const result = await CommentsTableTestHelper.get(commentId!);
      expect(response.statusCode).toEqual(200);
      expect(result[0].deleted_at).toBeInstanceOf(Date);
    });
  });

  describe('endpoint /threads/{threadId} or detail thread with comments', () => {
    const threadPayload = {
      id: undefined as string | undefined,
      title: 'Title Thread',
      body: 'description thread',
    };
    const commentPayload = {
      id: undefined as string | undefined,
      content: 'Description content',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        payload: threadPayload,
      });

      const responseJson = JSON.parse(threadResponse.payload);
      threadPayload.id = responseJson.data.addedThread.id;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        payload: commentPayload,
      });

      const responseCommentJson = JSON.parse(commentResponse.payload);
      commentPayload.id = responseCommentJson.data.addedComment.id;
    });

    it('should response 200 and get detail thread', async () => {
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadPayload.id}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.username).toEqual('dicoding');
    });
  });
});
