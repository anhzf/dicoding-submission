import { nullable, object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  id: string('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  username: string('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  content: string('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  date: string('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  deletedAt: nullable(string('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class GetComment implements Out {
  id!: string;
  username!: string;
  content!: string;
  date!: string;
  deletedAt!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('GET_COMMENT', Schema);
}
