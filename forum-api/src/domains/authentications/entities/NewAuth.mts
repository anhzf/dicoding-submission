import { object, parse, string, type Input, type Output } from 'valibot';

const Schema = object({
  accessToken: string('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  refreshToken: string('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class NewAuth implements Out {
  accessToken!: string;
  refreshToken!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated(input: In) {
    const inKeys = Object.keys(input);
    if (Object.keys(Schema.entries).some((key) => !inKeys.includes(key))) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    return parse(Schema, input);
  }
}
