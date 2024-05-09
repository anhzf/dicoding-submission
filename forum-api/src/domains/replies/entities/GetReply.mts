import { date, nullable, object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  id: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  username: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  date: date('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  content: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  deletedAt: nullable(date('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class GetReply implements Out {
  id!: string;
  username!: string;
  date!: Date;
  content!: string;
  deletedAt!: Date | null;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('REPLY', Schema);
}
