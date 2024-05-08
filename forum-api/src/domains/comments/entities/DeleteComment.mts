import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  commentId: string('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  threadId: string('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  ownerId: string('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class DeleteComment implements Out {
  commentId!: string;
  threadId!: string;
  ownerId!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('DELETE_COMMENT', Schema);
}
