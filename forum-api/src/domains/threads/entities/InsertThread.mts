import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  title: string('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  body: string('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  ownerId: string('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class InsertThread implements Out {
  title!: string;
  body!: string;
  ownerId!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('INSERT_THREAD', Schema);
}
