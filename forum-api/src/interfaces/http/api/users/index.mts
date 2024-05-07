import type { Plugin } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';
import UsersHandler from './handler.mjs';
import usersRoutes from './routes.mjs';

const UsersPlugin: Plugin<{
  container: Container;
}> = {
  name: 'users',
  register: async (server, { container }) => {
    const usersHandler = new UsersHandler(container);
    server.route(usersRoutes(usersHandler));
  },
};

export default UsersPlugin;
