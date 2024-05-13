import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  commentId: string('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  userId: string('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class CommentLike implements Out {
  commentId!: string;
  userId!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('COMMENT_LIKE', Schema);
}
