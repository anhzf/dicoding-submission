import { maxLength, object, regex, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  username: string('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION', [
    maxLength(50, 'REGISTER_USER.USERNAME_LIMIT_CHAR'),
    regex(/^[\w]+$/, 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'),
  ]),
  fullname: string('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  password: string('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class RegisterUser implements Out {
  username!: string;
  fullname!: string;
  password!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('REGISTER_USER', Schema);
}
