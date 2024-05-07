import { nanoid } from 'nanoid';
import containerRegistry from './container-registry.mjs';
import pool from './database/postgres/pool.mjs';
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.mjs';
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres.mjs';
import JwtTokenManager from './security/JwtTokenManager.mjs';
import Jwt from '@hapi/jwt';
import BcryptPasswordHash from './security/BcryptPasswordHash.mjs';
import bcrypt from 'bcrypt';
import AddUserUseCase from '../applications/use-cases/AddUserUseCase.mjs';
import LoginUserUseCase from '../applications/use-cases/LoginUserUseCase.mjs';
import LogoutUserUseCase from '../applications/use-cases/LogoutUserUseCase.mjs';
import RefreshAuthenticationUseCase from '../applications/use-cases/RefreshAuthenticationUseCase.mjs';

export interface Container {
  get: typeof containerRegistry.get;
}

containerRegistry.register('userRepository', () => new UserRepositoryPostgres(pool, nanoid));
containerRegistry.register('authenticationRepository', () => new AuthenticationRepositoryPostgres(pool));
containerRegistry.register('passwordHash', () => new BcryptPasswordHash(bcrypt, 10));
containerRegistry.register('authenticationTokenManager', () => new JwtTokenManager(Jwt.token));

containerRegistry.register('addUserUseCase', () => new AddUserUseCase({
  userRepository: containerRegistry.get('userRepository'),
  passwordHash: containerRegistry.get('passwordHash'),
}));
containerRegistry.register('loginUserUseCase', () => new LoginUserUseCase({
  userRepository: containerRegistry.get('userRepository'),
  authenticationRepository: containerRegistry.get('authenticationRepository'),
  passwordHash: containerRegistry.get('passwordHash'),
  authenticationTokenManager: containerRegistry.get('authenticationTokenManager'),
}));
containerRegistry.register('logoutUserUseCase', () => new LogoutUserUseCase({
  authenticationRepository: containerRegistry.get('authenticationRepository'),
}));
containerRegistry.register('refreshAuthenticationUseCase', () => new RefreshAuthenticationUseCase({
  authenticationRepository: containerRegistry.get('authenticationRepository'),
  authenticationTokenManager: containerRegistry.get('authenticationTokenManager'),
}));

const container: Container = {
  get: containerRegistry.get,
}

export default container;
