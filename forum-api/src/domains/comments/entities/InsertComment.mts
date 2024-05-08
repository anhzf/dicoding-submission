import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  threadId: string('INSERT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  ownerId: string('INSERT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  content: string('INSERT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class InsertComment implements Out {
  threadId!: string;
  ownerId!: string;
  content!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('INSERT_COMMENT', Schema);
}
