import { consola } from 'consola';

/**
 * @typedef {import('./PlaylistService.mjs').default} PlaylistService
 * @typedef {import('./MailService.mjs').default} MailService
 */

export default class Listener {
  /** @type {PlaylistService} */
  #playlistService;

  /** @type {MailService} */
  #mailService;

  /**
   * @param {PlaylistService} playlistService
   * @param {MailService} mailService
   */
  constructor(playlistService, mailService) {
    this.#playlistService = playlistService;
    this.#mailService = mailService;
  }

  /** @type {string} message */
  async listen(message) {
    const { id, targetEmail } = JSON.parse(message.content.toString());

    const playlist = await this.#playlistService.get(id);
    playlist.songs = await this.#playlistService.listSongs(id);

    try {
      const result = await this.#mailService.send(targetEmail, {
        subject: 'Ekspor Playlist',
        text: 'Terlampir hasil ekspor lagu playlist.',
        attachments: [{
          filename: 'playlist.json',
          content: JSON.stringify({ playlist }, null, 2),
        }],
      });
      consola.log(result);
    } catch (err) {
      consola.error(err);
    }
  }
}
