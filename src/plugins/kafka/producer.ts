import { KafkaClient as Client, Producer, ProduceRequest, KafkaClientOptions } from 'kafka-node';
/**
 * Kafka Producer
 */


export const publish = (client: Client, topic: string, message: string) => new Promise((resolve, rejects) => {
    // The producer handles publishing messages over a topic
    // const kafkaHost: string = process.env.KAFKA_HOST;
    // const kafkaClient = new Client({
    //     kafkaHost: kafkaHost
    // });
    const producer = new Producer(client);

    // First wait for the producer to be initialized
    // producer.on('ready', (): void => {
        // Update metadata for the topic we'd like to publish to
        client.refreshMetadata([topic], (err: Error): void => {
            if (err) {
                // throw err;
                rejects(err);
            }

            console.log(`Sending message to ${topic}: ${message}`);
            producer.send([{ topic, messages: [message] }], (error: Error, result: ProduceRequest): void => {
                console.log(error || result);

                if (result) { 
                    resolve(result);
                }
                if (error) {
                    rejects(error);
                }
            });
        });
    // });

    producer.on('error', (err: Error): void => {
        rejects(err);
    });
});

export const createTopic = (client: Client, topic: [string]) => new Promise((resolve, rejects) => {
    const producer = new Producer(client);

    // First wait for the producer to be initialized
    // producer.on('ready', () => {
        console.log(`Create topic ${topic}`);
        producer.createTopics(topic, (error, data) => {
            console.log(error || data);

            if (data) {
                resolve(data);
            }
            if (error) {
                rejects(error);
            }
        });
    // });

    producer.on('error', (err: Error): void => {
        rejects(err);
    });
});
