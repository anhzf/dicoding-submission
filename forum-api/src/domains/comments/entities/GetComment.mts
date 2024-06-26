import { date, nullable, object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  id: string('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  username: string('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  content: string('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  date: date('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  deletedAt: nullable(date('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class GetComment implements Out {
  id!: string;
  username!: string;
  content!: string;
  date!: Date;
  deletedAt!: Date;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('COMMENT', Schema);
}
