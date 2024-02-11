import type { Lifecycle } from '@hapi/hapi';
import type { Readable } from 'stream'

export type HandlerMethod = 'post' | 'get' | 'list' | 'put' | 'destroy';

export type Handlers = {
  [method in HandlerMethod]: Lifecycle.Method
};

export interface HasId {
  id: string;
}

export interface HapiPayloadStream extends Readable {
  hapi: {
    filename: string;
    headers: Record<string, string>;
  };
}
