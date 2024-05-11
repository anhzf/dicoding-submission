import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.mjs';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.mjs';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.mjs';
import container from '../../container.mjs';
import pool from '../../database/postgres/pool.mjs';
import createServer from '../createServer.mjs';

describe('/threads endpoint', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.truncate();
    await UsersTableTestHelper.truncate();
    await AuthenticationsTableTestHelper.truncate();
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

    user.accessToken = data.accessToken;
  });

  describe('when POST thread', () => {
    it('should throw error 401 when if not contain access token', async () => {
      const reqBody = {
        title: 'Title lorem',
        body: 'description lorem ipsum',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBody,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson).toBeDefined();
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should throw error 400 when request payload not contain needed property', async () => {
      const reqBody = {
        title: 'Title lorem',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBody,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson).toBeDefined();
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should throw error 400 when request payload not meet data type specification', async () => {
      const reqBody = {
        title: true,
        body: 123,
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: reqBody,
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson).toBeDefined();
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });

    it('should response 201 and new thread', async () => {
      const reqBody = {
        title: 'Title lorem',
        body: 'description lorem ipsum',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        payload: reqBody,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(reqBody.title);
    });
  });
});
