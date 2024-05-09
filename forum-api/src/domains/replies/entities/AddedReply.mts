import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  id: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  owner: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  content: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class AddedReply implements Out {
  id!: string;
  owner!: string;
  content!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('REPLY', Schema);
}
