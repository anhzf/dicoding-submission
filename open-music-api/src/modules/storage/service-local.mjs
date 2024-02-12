// @ts-check
import {
  createWriteStream,
  existsSync, mkdirSync,
} from 'fs';
import { resolve as pathResolve } from 'path';
import ClientError from '../../errors/client.mjs';

/**
 * @typedef {import('./types').StorageService} Service
 */

/** @implements {Service} */
export default class StorageLocalService {
  #root;

  constructor(root = './storage') {
    const projectRoot = /** @type {string} */ (process.env.INIT_CWD);
    this.#root = pathResolve(projectRoot, root);
  }

  /**
   * @param {string} key
   * @param {import('stream').Readable} file
   * @param {import('./types').StorageUploadOptions} opts
   */
  async upload(key, file, opts) {
    const [origFilename, ...dirs] = key.split('/').reverse();
    const filename = [+new Date(), origFilename].join('_');
    const path = pathResolve(this.#root, ...dirs, filename);

    // Determine the folder paths
    const folder = path.replace(/\\/g, '/').split('/') // Normalize path on Windows
      .slice(0, -1).join('/')
      .replace(/\//g, '\\');

    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }

    const stream = createWriteStream(path);

    if (opts.maxSize) {
      file.on('data', (chunk) => {
        if (stream.bytesWritten + chunk.length > /** @type {number} */ (opts.maxSize)) {
          file.destroy(new ClientError('File yang diunggah melebihi batas maksimum', 413));
        }
      });
    }

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      file.on('error', reject);
      file.pipe(stream);
      file.on('end', () => resolve(path.replace(this.#root, '').replace(/\\/g, '/') /* relative path */));
    });
  }
}
