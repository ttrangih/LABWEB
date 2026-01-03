const amqp = require('amqplib');
const { faker } = require('@faker-js/faker');

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE = 'messages';

function fakeMessage() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    content: faker.lorem.sentence(),
    time: new Date().toISOString()
  };
}

(async () => {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE);

  console.log('Producer running...');
  setInterval(() => {
    const msg = fakeMessage();
    ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)));
    console.log('Sent:', msg);
  }, 3000);
})();
