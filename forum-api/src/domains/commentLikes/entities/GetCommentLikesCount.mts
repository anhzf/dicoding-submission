import { number, object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  commentId: string('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  count: number('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class GetCommentLikesCount implements Out {
  commentId!: string;
  count!: number;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('COMMENT_LIKE', Schema);
}
