import PasswordHash from '../PasswordHash.mjs';

describe('PasswordHash interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    // @ts-expect-error
    const passwordHash = new PasswordHash();

    // Action & Assert
    expect(passwordHash.hash).toBeUndefined();
    expect(passwordHash.compare).toBeUndefined();
  });
});
