import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  id: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  userId: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  commentId: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  threadId: string('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class DeleteReply implements Out {
  id!: string;
  userId!: string;
  commentId!: string;
  threadId!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('REPLY', Schema);
}
