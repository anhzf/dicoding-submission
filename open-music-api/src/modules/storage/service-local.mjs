// @ts-check
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
// import { resolve as pathResolve } from 'path';

/**
 * @typedef {import('./types').StorageService} Service
 */

/** @implements {Service} */
export default class StorageLocalService {
  #root;

  constructor(root = '/storage') {
    this.#root = fileURLToPath(new URL(root, process.cwd()));
  }

  /**
   * @param {string} key
   * @param {import('stream').Readable} file
   */
  async upload(key, file) {
    const path = `${this.#root}/${[+new Date(), key].join('_')}`;

    const stream = createWriteStream(path);

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      file.pipe(stream);
      stream.on('finish', () => resolve(path));
    });
  }
}
