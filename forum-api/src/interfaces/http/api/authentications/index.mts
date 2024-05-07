import type { Plugin } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';
import AuthenticationsHandler from './handler.mjs';
import authenticationRoutes from './routes.mjs';

const AuthenticationsPlugin: Plugin<{
  container: Container;
}> = {
  name: 'authentications',
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);
    server.route(authenticationRoutes(authenticationsHandler));
  },
};

export default AuthenticationsPlugin;
