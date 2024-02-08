import type { Output } from 'valibot';
import type { UserPayloadSchema, UserPublicSchema } from './schema.mjs';

export interface UserService {
  register(payload: Output<typeof UserPayloadSchema>): Promise<string>;
  get(id: string): Promise<Output<typeof UserPublicSchema>>;
  verifyUsername(username: string): Promise<void>;
  verifyCredential(username: string, password: string): Promise<void>;
}

export interface UserPluginOptions {
  service: UserService;
}
