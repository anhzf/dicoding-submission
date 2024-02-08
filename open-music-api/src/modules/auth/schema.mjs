import { object, string } from 'valibot';

export const RefreshTokenSchema = object({
  token: string(),
});

export const PostSchema = object({
  username: string(),
  password: string(),
});

export const PutSchema = object({
  refreshToken: string(),
});

export const DeleteSchema = object({
  refreshToken: string(),
});
