import { object, parse, string, type Input, type Output } from 'valibot';

const Schema = object({
  username: string('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  password: string('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class UserLogin implements Out {
  username!: string;
  password!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated(input: In) {
    const inKeys = Object.keys(input);
    if (Object.keys(Schema.entries).some((key) => !inKeys.includes(key))) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    return parse(Schema, input);
  }
}
