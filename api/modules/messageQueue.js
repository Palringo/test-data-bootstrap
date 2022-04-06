
// 3rd party dependencies
const config = require('config');

// Palringo dependencies
const pubsub = require('@palringo/pubsub');

// Constants
const TEST_PUBLICATION = '/test';

async function init() {
    const amqpConfiguration = config.get('amqp');

    const consumerConfiguration = config.util.cloneDeep(amqpConfiguration);
    consumerConfiguration.vhosts['/'].connection = config.get('rabbit.consumer');

    const producerConfiguration = config.util.cloneDeep(amqpConfiguration);
    producerConfiguration.vhosts['/'].connection = config.get('rabbit.producer');

    await pubsub.initialise({
        consumer: consumerConfiguration,
        producer: producerConfiguration,
        applyDefaultConfig: true,
    });
}

async function destroy() {
    await pubsub.terminate();
}

async function createMessageSubscription(processMessage) {
    await pubsub.createSubscription('/test.queue', processMessage);
}

async function publishTestMessage() {
    const message = {};
    const routingKey = 'test';

    await pubsub.publishMessage(TEST_PUBLICATION, message, routingKey);
}

module.exports = {
    init,
    destroy,
    createMessageSubscription,
    publishTestMessage,
};
