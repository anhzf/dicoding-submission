import {
  enumType, object, optional, parse, string, transform,
} from 'valibot';
import BookRepository from './repository.mjs';

/**
 * @typedef {import('@hapi/hapi').Lifecycle.Method} Handler
*/

const success = (data, message) => ({
  status: 'success',
  data,
  message,
});

const fail = (message) => ({
  status: 'fail',
  message,
});

const QueryTruthySchema = transform(enumType(['0', '1']), (value) => value === '1');

const ListQuerySchema = object({
  name: optional(string()),
  finished: optional(QueryTruthySchema),
  reading: optional(QueryTruthySchema),
});

/**
 * @type {Handler}
 */
export const list = async (req, h) => {
  const query = parse(ListQuerySchema, req.query, { abortEarly: true });
  const books = await BookRepository.list(query);
  const data = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h.response(success(
    { books: data },
  ));
};

/**
 * @type {Handler}
 */
export const create = async (req, h) => {
  try {
    const newBook = await BookRepository.create(req.payload);

    return h.response(success(
      { bookId: newBook.id },
      'Buku berhasil ditambahkan',
    ))
      .code(201);
  } catch (err) {
    return h.response(fail(`Gagal menambahkan buku. ${err.message || err}`))
      .code(400);
  }
};

/**
 * @type {Handler}
 */
export const get = async (req, h) => {
  const { bookId } = req.params;
  const book = await BookRepository.get(bookId);

  if (!book) {
    return h.response(fail('Buku tidak ditemukan')).code(404);
  }

  return h.response(success({ book }));
};

/**
 * @type {Handler}
 */
export const update = async (req, h) => {
  try {
    const { bookId } = req.params;

    await BookRepository.update(bookId, req.payload);

    return h.response(success(undefined, 'Buku berhasil diperbarui'));
  } catch (err) {
    const errDetail = err.message === 'NOT_FOUND'
      ? 'Id tidak ditemukan'
      : err.message || err;

    return h.response(fail(`Gagal memperbarui buku. ${errDetail}`))
      .code(err.message === 'NOT_FOUND' ? 404 : 400);
  }
};

/**
 * @type {Handler}
 */
export const remove = async (req, h) => {
  try {
    const { bookId } = req.params;
    await BookRepository.delete(bookId);

    return h.response(success(undefined, 'Buku berhasil dihapus'));
  } catch (err) {
    const errDetail = err.message === 'NOT_FOUND'
      ? 'Id tidak ditemukan'
      : err.message || err;

    return h.response(fail(`Buku gagal dihapus. ${errDetail}`))
      .code(err.message === 'NOT_FOUND' ? 404 : 400);
  }
};
