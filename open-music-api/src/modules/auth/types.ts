import type { Lifecycle } from '@hapi/hapi';
import type { TokenManager } from '../tokenize/index.mjs';
import type { UserService } from '../user/types';

export interface AuthService {
  storeRefreshToken(token: string): Promise<void>;
  verifyRefreshToken(token: string): Promise<void>;
  destroyRefreshToken(token: string): Promise<void>;
}

export interface AuthHandler {
  post: Lifecycle.Method;
  put: Lifecycle.Method;
  destroy: Lifecycle.Method;
}

export interface AuthPluginOptions {
  service: AuthService;
  userService: UserService;
  tokenManager: typeof TokenManager;
}
