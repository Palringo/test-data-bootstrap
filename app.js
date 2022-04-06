// 3rd party dependencies
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });

// Palringo dependencies
const loggerFactory = require('@palringo/logger')();

// Local dependencies
const swagger = require('./api/swagger/swagger');
const messageQueue = require('./api/modules/messageQueue');

// Variables
const logger = loggerFactory.getLogger('Main');

logger.info(`Node Version: ${process.version}`);

const init = async() => {
    let server;

    try {
        // Add any other initialisation stuff in here
        await messageQueue.init();
        server = await swagger.init();
    } catch (err) {
        logger.error('Unable to initialise application: ', err);

        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }

    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received, performing shutdown');

        server.close(async() => {
            logger.info('Http server closed');

            await messageQueue.destroy();
            process.exitCode = 0;
        });
    });
};

init();
