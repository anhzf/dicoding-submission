import type { Lifecycle } from '@hapi/hapi';

export type HandlerMethod = 'post' | 'get' | 'list' | 'put' | 'destroy';

export type Handlers = {
  [method in HandlerMethod]: Lifecycle.Method
};

export interface HasId {
  id: string;
}
