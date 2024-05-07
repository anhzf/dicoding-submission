import { object, parse, string, type Input, type Output } from 'valibot';

const Schema = object({
  id: string('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  username: string('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  fullname: string('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class RegisteredUser implements Out {
  id!: string;
  username!: string;
  fullname!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated(input: In) {
    const inKeys = Object.keys(input);
    if (Object.keys(Schema.entries).some((key) => !inKeys.includes(key))) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    return parse(Schema, input);
  }
}
