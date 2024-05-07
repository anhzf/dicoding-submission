// interface ContainerRegistry {

import type AuthenticationTokenManager from '../applications/security/AuthenticationTokenManager.mjs';
import type PasswordHash from '../applications/security/PasswordHash.mjs';
import type AddUserUseCase from '../applications/use-cases/AddUserUseCase.mjs';
import type LoginUserUseCase from '../applications/use-cases/LoginUserUseCase.mjs';
import type LogoutUserUseCase from '../applications/use-cases/LogoutUserUseCase.mjs';
import type RefreshAuthenticationUseCase from '../applications/use-cases/RefreshAuthenticationUseCase.mjs';
import type AuthenticationRepository from '../domains/authentications/AuthenticationRepository.mjs';
import UserRepository from '../domains/users/UserRepository.mjs';

interface ServiceMap {
  userRepository: UserRepository;
  authenticationRepository: AuthenticationRepository;
  passwordHash: PasswordHash;
  authenticationTokenManager: AuthenticationTokenManager;
  addUserUseCase: AddUserUseCase;
  loginUserUseCase: LoginUserUseCase;
  logoutUserUseCase: LogoutUserUseCase;
  refreshAuthenticationUseCase: RefreshAuthenticationUseCase;
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
