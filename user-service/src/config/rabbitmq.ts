import amql from "amqplib";

let channel: amql.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connectionUrl = process.env.CLOUDAMQP_URL;

    if (!connectionUrl) {
      throw new Error("CLOUDAMQP_URL environment variable not set!");
    }

    const connection = await amql.connect(connectionUrl);
    channel = await connection.createChannel();
    console.log("✅ connected to rabbitmq");
  } catch (error) {
    console.log("Failed to connect to rabbitmq", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.log("Rabbitmq channel is not initalized");
    return;
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};
