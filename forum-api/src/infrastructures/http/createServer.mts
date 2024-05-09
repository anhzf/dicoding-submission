import Hapi from '@hapi/hapi';
import { plugin as InertPlugin } from '@hapi/inert';
import { plugin as JwtPlugin } from '@hapi/jwt';
import UsersPlugin from '../../interfaces/http/api/users/index.mjs';
import AuthenticationsPlugin from '../../interfaces/http/api/authentications/index.mjs';
import DomainErrorTranslator from '../../commons/exceptions/DomainErrorTranslator.mjs';
import { ClientError } from '../../commons/exceptions/ClientError.mjs';
import type { Container } from '../container.mjs';
import ThreadsPlugin from '../../interfaces/http/api/threads/index.mjs';

declare global {
  interface Error {
    isServer?: boolean;
  }
}

const createServer = async (container: Container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    { plugin: JwtPlugin },
    { plugin: InertPlugin },
  ]);

  server.auth.strategy('default', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts: { decoded: { payload: AuthenticatedUser } }) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: UsersPlugin,
      options: { container },
    },
    {
      plugin: AuthenticationsPlugin,
      options: { container },
    },
    {
      plugin: ThreadsPlugin,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response);

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!translatedError.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  return server;
};

export default createServer;
