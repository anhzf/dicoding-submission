import {
  parse,
} from 'valibot';
import { BookSchema, UpdateBookSchema } from './schema.mjs';

/**
 * @typedef {import('valibot').Input}
 * @typedef {import('valibot').Output}
 * @typedef {typeof BookSchema} BookSchema
 */

/** @type {Output<BookSchema>[]} */
const store = [];

/**
 * @param {string} id
 */
const hasBook = async (id) => store.findIndex((book) => book.id === id) !== -1;

/**
 * @param {string} id
 */
const getBook = async (id) => store.find((book) => book.id === id) || null;

const getBooks = async ({ name, reading, finished }) => {
  const nameMatcher = new RegExp(name, 'gi');
  const filtered = store.filter((el) => (name !== undefined
    ? el.name.match(nameMatcher) : true)
    && (reading !== undefined
      ? el.reading === reading : true)
    && (finished !== undefined
      ? el.finished === finished : true));

  return filtered;
};

/**
 * @param {Input<BookSchema>} data
 */
const createBook = async (data) => {
  const output = parse(BookSchema, data, { abortEarly: true });

  if (await hasBook(output.id)) {
    throw new Error('ALREADY_EXISTS');
  }

  store.push(output);
  return output;
};

/**
 * @param {string} id
 * @param {Input<typeof UpdateSchema>} data
 */
const updateBook = async (id, data) => {
  const existingBook = await getBook(id);

  if (!existingBook) {
    throw new Error('NOT_FOUND');
  }

  const output = parse(UpdateBookSchema, data, { abortEarly: true });
  const updatedData = {
    ...existingBook,
    ...output,
    id,
    updatedAt: new Date(),
  };

  store.splice(store.findIndex((book) => book.id === id), 1, updatedData);
  return updatedData;
};

const deleteBook = async (id) => {
  if (!(await hasBook(id))) {
    throw new Error('NOT_FOUND');
  }

  store.splice(store.findIndex((book) => book.id === id), 1);
};

const BookRepository = {
  get: getBook,
  list: getBooks,
  create: createBook,
  update: updateBook,
  delete: deleteBook,
};

export default BookRepository;
