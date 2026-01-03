const amqp = require('amqplib');
const { faker } = require('@faker-js/faker');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE = 'messages';

function createMessage() {
  return {
    producer: 'Producer-2',
    id: faker.string.uuid(),
    content: faker.lorem.words(5),
    time: new Date().toISOString()
  };
}

(async () => {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE);

  console.log('Producer-2 running...');
  setInterval(() => {
    const msg = createMessage();
    ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)));
    console.log('Sent:', msg);
  }, 5000);
})();
