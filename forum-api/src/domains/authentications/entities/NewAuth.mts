import { object, parse, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

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

  #validated = createEntityValidator('NEW_AUTH', Schema);
}
