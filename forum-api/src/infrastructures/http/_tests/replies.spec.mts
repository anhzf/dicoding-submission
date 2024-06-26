import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.mjs';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.mjs';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.mjs';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import container from '../../container.mjs';
import pool from '../../database/postgres/pool.mjs';
import createServer from '../createServer.mjs';

describe('/replies endpoint', () => {
  afterEach(async () => {
    await Promise.all([
      RepliesTableTestHelper.truncate(),
      CommentsTableTestHelper.truncate(),
      ThreadsTableTestHelper.truncate(),
      UsersTableTestHelper.truncate(),
      AuthenticationsTableTestHelper.truncate(),
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  const dataUser = {
    username: 'anhzf',
    password: 'password',
    fullname: 'Alwan Nuha',
    accessToken: '',
  };

  beforeEach(async () => {
    const server = await createServer(container);
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: dataUser.username,
        password: dataUser.password,
        fullname: dataUser.fullname,
      },
    });

    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: dataUser.username,
        password: dataUser.password,
      },
    });

    const { data } = JSON.parse(response.payload);
    dataUser.accessToken = data.accessToken;
  });

  describe('endpoint /threads/{threadId}/comments/{commentId}/replies', () => {
    const reqBodyThread = {
      title: 'title thread',
      body: 'body thread',
      id: '',
      commentId: '',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBodyThread,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      reqBodyThread.id = responseThreadJson.data.addedThread.id;

      const reqBodyComment = {
        content: 'body content',
      };

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments`,
        payload: reqBodyComment,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);
      reqBodyThread.commentId = responseCommentJson.data.addedComment.id;
    });

    it('should response 201 and new replies', async () => {
      const reqBody = {
        content: 'body content',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments/${reqBodyThread.commentId}/replies`,
        payload: reqBody,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(reqBody.content);
    });

    it('should throw error 400 when request payload not contain needed property', async () => {
      const payload = {};

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments/${reqBodyThread.commentId}/replies`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada',
      );
    });
    it('should throw error 400 when request payload not meet data type specification', async () => {
      const payload = {
        content: [123, 'lorem'],
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${reqBodyThread.id}/comments/${reqBodyThread.commentId}/replies`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena tipe data tidak sesuai',
      );
    });
  });

  describe('endpoint /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    const threadPayload = {
      title: 'Title Thread',
      body: 'description thread',
      id: '',
    };
    const commentPayload = {
      content: 'Description content',
      id: '',
    };
    const replyPayload = {
      content: 'Description content',
      id: '',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: threadPayload,
      });

      const responseThreadJson = JSON.parse(threadResponse.payload);
      threadPayload.id = responseThreadJson.data.addedThread.id;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: commentPayload,
      });

      const responseCommentJson = JSON.parse(commentResponse.payload);
      commentPayload.id = responseCommentJson.data.addedComment.id;

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: replyPayload,
      });

      const responseReplyJson = JSON.parse(replyResponse.payload);
      replyPayload.id = responseReplyJson.data.addedReply.id;
    });

    it('should throw error 401 when if not contain access token', async () => {
      const threadId = threadPayload.id;
      const commentId = commentPayload.id;
      const replyId = replyPayload.id;

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });
      const result = await RepliesTableTestHelper.get(replyId);
      expect(response.statusCode).toEqual(401);
      expect(result.deleted_at).toBeNull();
    });

    it('should response 200 and delete comment correctly', async () => {
      const threadId = threadPayload.id;
      const commentId = commentPayload.id;
      const replyId = replyPayload.id;

      const server = await createServer(container);
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
      });
      const result = await RepliesTableTestHelper.get(replyId);
      expect(response.statusCode).toEqual(200);
      expect(result.deleted_at).not.toBeNull();
    });
  });

  describe('endpoint /threads/{threadId} or detail thread with comments and reply', () => {
    const threadPayload = {
      title: 'Title Thread',
      body: 'description thread',
      id: '',
    };
    const commentPayload = {
      content: 'Description content',
      id: '',
    };
    const replyPayload = {
      content: 'Description content',
      id: '',
    };

    beforeEach(async () => {
      const server = await createServer(container);
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: threadPayload,
      });

      const responseJson = JSON.parse(threadResponse.payload);
      threadPayload.id = responseJson.data.addedThread.id;

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: commentPayload,
      });

      const responseCommentJson = JSON.parse(commentResponse.payload);
      commentPayload.id = responseCommentJson.data.addedComment.id;

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies`,
        headers: {
          Authorization: `Bearer ${dataUser.accessToken}`,
        },
        payload: replyPayload,
      });

      const responseReplyJson = JSON.parse(replyResponse.payload);
      replyPayload.id = responseReplyJson.data.addedReply.id;
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
      expect(responseJson.data.thread.username).toEqual('anhzf');
    });
  });
});
