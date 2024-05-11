import containerRegistry from './container-registry.mjs';

describe('container-registry', () => {
  it('should throw error when service not registered', () => {
    expect(() => containerRegistry.get('passwordHash')).toThrowError(
      'Service passwordHash not registered',
    );
  });

  it('should register and return service', () => {
    const passwordHash = {
      hash: () => Promise.resolve('hashed_password'),
      compare: () => Promise.resolve(),
    };
    containerRegistry.register('passwordHash', () => passwordHash);

    const result = containerRegistry.get('passwordHash');
    expect(result).toEqual(passwordHash);
  });
});
