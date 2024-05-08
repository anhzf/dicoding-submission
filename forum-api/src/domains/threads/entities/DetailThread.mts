import { object, string, type Input, type Output } from 'valibot';
import { createEntityValidator } from '../../../commons/utils/entity.mjs';

const Schema = object({
  id: string('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  title: string('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  body: string('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  date: string('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
  username: string('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
});

type In = Input<typeof Schema>;
type Out = Output<typeof Schema>;

export default class DetailThread implements Out {
  id!: string;
  title!: string;
  body!: string;
  date!: string;
  username!: string;

  constructor(attrs: In) {
    Object.assign(this, this.#validated(attrs));
  }

  #validated = createEntityValidator('THREAD', Schema);
}
