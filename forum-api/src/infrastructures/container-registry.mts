// interface ContainerRegistry {

import type AuthenticationTokenManager from '../applications/security/AuthenticationTokenManager.mjs';
import type PasswordHash from '../applications/security/PasswordHash.mjs';
import type AddCommentUseCase from '../applications/use-cases/AddCommentUseCase.mjs';
import type AddThreadUseCase from '../applications/use-cases/AddThreadUseCase.mjs';
import type AddUserUseCase from '../applications/use-cases/AddUserUseCase.mjs';
import type DeleteCommentUseCase from '../applications/use-cases/DeleteCommentUseCase.mjs';
import type GetDetailThreadUseCase from '../applications/use-cases/GetDetailThreadUseCase.mjs';
import type LoginUserUseCase from '../applications/use-cases/LoginUserUseCase.mjs';
import type LogoutUserUseCase from '../applications/use-cases/LogoutUserUseCase.mjs';
import type RefreshAuthenticationUseCase from '../applications/use-cases/RefreshAuthenticationUseCase.mjs';
import type AuthenticationRepository from '../domains/authentications/AuthenticationRepository.mjs';
import type CommentRepository from '../domains/comments/CommentRepository.mjs';
import type ThreadRepository from '../domains/threads/ThreadRepository.mjs';
import UserRepository from '../domains/users/UserRepository.mjs';

interface ServiceMap {
  passwordHash: PasswordHash;
  authenticationTokenManager: AuthenticationTokenManager;
  userRepository: UserRepository;
  authenticationRepository: AuthenticationRepository;
  threadRepository: ThreadRepository;
  commentRepository: CommentRepository;
  addUserUseCase: AddUserUseCase;
  loginUserUseCase: LoginUserUseCase;
  logoutUserUseCase: LogoutUserUseCase;
  refreshAuthenticationUseCase: RefreshAuthenticationUseCase;
  addThreadUseCase: AddThreadUseCase;
  getDetailThreadUseCase: GetDetailThreadUseCase;
  addCommentUseCase: AddCommentUseCase;
  deleteCommentUseCase: DeleteCommentUseCase;
}

interface ServiceRegister<K extends keyof ServiceMap> {
  (): ServiceMap[K];
}

const registrationMap = new Map();
const serviceMap = new Map();

const get = <K extends keyof ServiceMap>(key: K): ServiceMap[K] => {
  const service = serviceMap.get(key);
  if (!service) {
    const registration = registrationMap.get(key);
    if (registration) {
      const newService = registration();
      serviceMap.set(key, newService);
      return newService;
    }

    throw new Error(`Service ${key} not registered`);
  }
  return service;
}

const register = <K extends keyof ServiceMap>(key: K, registration: ServiceRegister<K>) => {
  registrationMap.set(key, registration);
};

const containerRegistry = {
  get,
  register,
};

export default containerRegistry;
