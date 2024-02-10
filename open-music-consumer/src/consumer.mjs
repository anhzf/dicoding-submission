import amqp from 'amqplib';
import MailService from './MailService.mjs';
import PlaylistService from './PlaylistService.mjs';
import config from './config.mjs';
import Listener from './listener.mjs';

const QUEUE_NAME = 'export:playlist';

export const consume = async () => {
  const playlistService = new PlaylistService();
  const mailService = new MailService();
  const listener = new Listener(playlistService, mailService);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  channel.consume(QUEUE_NAME, listener.listen.bind(listener), {
    noAck: true,
  });
};
