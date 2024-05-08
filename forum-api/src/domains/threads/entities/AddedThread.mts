import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  id: string('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  title: string('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  owner: string('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class AddedThread implements Out {
  id!: string;
  title!: string;
  owner!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('THREAD', Schema);
}
