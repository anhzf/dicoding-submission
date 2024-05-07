import { maxLength, object, parse, regex, string, type Input, type Output } from 'valibot';

const Schema = object({
  username: string('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION', [maxLength(50, 'REGISTER_USER.USERNAME_LIMIT_CHAR'), regex(/^[\w]+$/, 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')]),
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

  #validated(input: In) {
    const inKeys = Object.keys(input);
    if (Object.keys(Schema.entries).some((key) => !inKeys.includes(key))) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    return parse(Schema, input);
  }
}
