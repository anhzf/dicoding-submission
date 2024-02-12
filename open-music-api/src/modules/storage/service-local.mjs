// @ts-check
import {
  createWriteStream,
  existsSync, mkdirSync,
} from 'fs';
import { resolve as pathResolve } from 'path';
import config from '../../config.mjs';

/**
 * @typedef {import('./types').StorageService} Service
 */

/** @implements {Service} */
export default class StorageLocalService {
  baseDir;

  public;

  get root() {
    const projectRoot = /** @type {string} */ (process.env.INIT_CWD);
    return pathResolve(projectRoot, this.baseDir);
  }

  /**
   * @param {string} baseDir relative to project root
   * @param {string} basePublic relative to host url
   */
  constructor(baseDir = './storage', basePublic = '/storage') {
    this.baseDir = baseDir;
    this.public = basePublic;
  }

  /**
   * @param {string} key
   * @param {import('stream').Readable} file
   */
  async upload(key, file) {
    const [origFilename, ...dirs] = key.split('/').reverse();
    const filename = [+new Date(), origFilename].join('_');
    const path = pathResolve(this.root, ...dirs, filename);

    // Determine the folder paths
    const folder = path.replace(/\\/g, '/').split('/')
      .slice(0, -1).join('/');

    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
    }

    const stream = createWriteStream(path);

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      file.on('error', reject);
      file.pipe(stream);
      file.on('end', () => resolve(path.replace(this.root, '')/* relative path */));
    });
  }

  /**
   * @param {string} key
   */
  getUrl(key) {
    return new URL([this.public, key].join(''), `http://${config.host}:${config.port}`).toString();
  }

  /**
   * @returns {import('@hapi/hapi').ServerRoute[]}
   */
  getRoutes() {
    return [
      {
        method: 'GET',
        path: [this.public, '{param*}'].join('/'),
        handler: {
          directory: {
            path: this.root,
          },
        },
      },
    ];
  }
}
