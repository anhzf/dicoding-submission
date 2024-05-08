import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  id: string('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  content: string('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  owner: string('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class AddedComment implements Out {
  id!: string;
  content!: string;
  owner!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('ADDED_COMMENT', Schema);
}
