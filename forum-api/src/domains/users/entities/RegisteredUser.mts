import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

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

  #validated = createEntityValidator('REGISTERED_USER', Schema);
}
