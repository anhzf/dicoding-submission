import createServer from '../createServer.mjs';

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    // Arrange
    // @ts-expect-error
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  it('should handle server error with data when not in production', async () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    // @ts-expect-error
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
    expect(responseJson.data).not.toBeNull();
  });

  it('should handle server error with no data when in production', async () => {
    // Arrange
    process.env.NODE_ENV = 'production';
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    // @ts-expect-error
    const server = await createServer({}); // fake injection

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
    expect(responseJson.data).toBeNull();
  });

  it('has a welcome message', async () => {
    // Arrange
    // @ts-expect-error
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.payload)).toEqual({
      status: 'success',
      message: 'Welcome to Forum API!',
    });
  });
});
