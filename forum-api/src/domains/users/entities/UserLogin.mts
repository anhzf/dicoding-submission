import { object, parse, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

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

  #validated = createEntityValidator('USER_LOGIN', Schema);
}
