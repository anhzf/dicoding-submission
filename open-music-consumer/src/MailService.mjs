import { createTransport } from 'nodemailer';
import config from './config.mjs';

export default class MailService {
  #transporter = createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });

  /**
   * @param {string} recipient
   * @param {Pick<import('nodemailer').SendMailOptions, 'subject' | 'text' | 'attachments'>} options
   */
  send(recipient, options) {
    return this.#transporter.sendMail({
      ...options,
      from: config.mail.from,
      to: recipient,
    });
  }
}
