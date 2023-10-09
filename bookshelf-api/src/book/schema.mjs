import { nanoid } from 'nanoid';
import {
  boolean, coerce, custom, date,
  minValue,
  number,
  object,
  omit,
  optional,
  string, toTrimmed,
  transform,
} from 'valibot';

const DateSchema = coerce(date(), (v) => new Date(v));

export const BookSchema = transform(
  object({
    id: optional(string(), nanoid),
    name: string('Mohon isi nama buku', [toTrimmed()]),
    year: number(),
    author: string([toTrimmed()]),
    summary: string([toTrimmed()]),
    publisher: string([toTrimmed()]),
    pageCount: number([minValue(1)]),
    readPage: number(),
    reading: optional(boolean(), false),
    insertedAt: optional(DateSchema, () => new Date()),
    updatedAt: optional(DateSchema, () => new Date()),
  }, [
    custom(
      (input) => (input.readPage <= input.pageCount),
      'readPage tidak boleh lebih besar dari pageCount',
    ),
  ]),
  (output) => ({
    ...output,
    get finished() {
      return output.readPage === output.pageCount;
    },
  }),
);

export const UpdateBookSchema = (() => {
  const schema = omit(BookSchema, ['id', 'insertedAt', 'updatedAt']);
  // assign ._parse() method from BookSchema to inherit the pipeline and transforms
  schema._parse = BookSchema._parse.bind(BookSchema);
  return schema;
})();
