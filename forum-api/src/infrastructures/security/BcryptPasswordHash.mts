import PasswordHash from '../../applications/security/PasswordHash.mjs';
import AuthenticationError from '../../commons/exceptions/AuthenticationError.mjs';

interface Encryptor {
  hash(password: string, salt: number): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}

export default class BcryptPasswordHash extends PasswordHash {
  constructor(
    private bcrypt: Encryptor,
    private saltRound = 10
  ) {
    super();
  }

  hash(password: string): Promise<string> {
    return this.bcrypt.hash(password, this.saltRound);
  }

  async compare(plain: string, encrypted: string): Promise<void> {
    const result = await this.bcrypt.compare(plain, encrypted);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}
