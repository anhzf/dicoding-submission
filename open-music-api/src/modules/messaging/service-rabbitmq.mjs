// @ts-check
import amqp from 'amqplib';
import config from '../../config.mjs';

const CONN_TIMEOUT = 1000;

/**
 * @typedef {import('./types').MessagingService} Service
 */

/** @satisfies {Service} */
const MessagingRabbitMqService = {
  /**
   * @param {string} name
   * @param {*} message
   */
  async send(name, message) {
    const connection = await amqp.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();

    await channel.assertQueue(name, { durable: true });

    await channel.sendToQueue(name, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, CONN_TIMEOUT);
  },
};

export default MessagingRabbitMqService;
