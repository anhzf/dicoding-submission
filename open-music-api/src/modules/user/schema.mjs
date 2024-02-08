import { nanoid } from 'nanoid';
import {
  object, omit, optional, string,
} from 'valibot';

export const UserSchema = object({
  id: optional(string(), () => `user-${nanoid()}`),
  username: string(),
  fullname: string(),
  password: string(),
});

export const UserPayloadSchema = omit(UserSchema, ['id']);

export const UserPublicSchema = omit(UserSchema, ['password']);
