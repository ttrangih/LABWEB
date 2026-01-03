const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE = 'messages';

(async () => {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE);

  console.log('Waiting for messages...');
  ch.consume(QUEUE, (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log('Received:', data);
    ch.ack(msg);
  });
})();
