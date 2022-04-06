/* eslint-disable no-process-exit,promise/catch-or-return,no-loop-func */

// Third party dependencies
const amqp = require('amqplib');
const config = require('config');
const Docker = require('dockerode');

// Palringo dependencies
const { DbPool } = require('@palringo/db').mysql;
const loggerFactory = require('@palringo/logger')();

// Local dependencies
function moduleIsAvailable(path) {
    try {
        require.resolve(path);
        return true;
    } catch (e) {
        return false;
    }
}
const db = moduleIsAvailable('./db.sql') ? require('./db.sql') : {};
const table = moduleIsAvailable('./table.sql') ? require('./table.sql') : {};
const data = moduleIsAvailable('./data.sql') ? require('./data.sql') : {};
const fn = moduleIsAvailable('./function.sql') ? require('./function.sql') : {};
const user = moduleIsAvailable('./user.sql') ? require('./user.sql') : {};

// Variables
const dbSetupCfg = config.get('dbSetup');
const database = new DbPool(dbSetupCfg);
const docker = new Docker();
const logger = loggerFactory.getLogger('IntegrationTestBootstrap');

let mySqlContainer;
let rabbitContainer;
let redisContainer;

// Constants
const CLEANUP_TIMEOUT = 50000;
const CONNECTION_TIMEOUT = 15000;
const RETRY_TIMEOUT = 1000;

const MYSQL_IMAGE = 'mysql:5.6';
const MYSQL_DATABASE = dbSetupCfg.database;
const MYSQL_PORT = dbSetupCfg.port.toString();
const MYSQL_ROOT_PASSWORD = dbSetupCfg.password;

const RABBIT_IMAGE = 'rabbitmq:latest';
const RABBIT_HOST = config.get('messageQueue.amqp.host');
const RABBIT_PORT = config.get('messageQueue.amqp.port').toString();

const REDIS_IMAGE = 'redis:latest';
const REDIS_PORT = config.get('cache.port').toString();

async function pullImage(image) {
    const images = await docker.listImages({ filters: `{"reference": ["${image}"]}` });

    if (images.length === 0) {
        logger.info(`Pulling ${image} docker image`);

        await new Promise((resolve, reject) => {
            docker.pull(image, (err, stream) => {
                if (err) {
                    return reject(err);
                }
                return docker.modem.followProgress(stream, resolve);
            });
        });
    }
}

const createContainer = async(image, portBindings, envVars) => {
    const options = {
        Image: image,
        Name: `integration-test-${image}`,
        Hostname: `integration-test-${image}`,
        HostConfig: { PortBindings: portBindings },
    };
    if (envVars) {
        options.Env = envVars;
    }

    const container = await docker.createContainer(options);

    await container.start();
    return container;
};

const cleanupAfterError = () => {
    async function destroyContainer(container) {
        if (container) {
            try {
                await container.stop();
            } catch (err) {
                logger.error(`Error stopping container: ${err}`);
                throw err;
            } finally {
                await container.remove();
            }
        }
    }

    Promise.all([
        destroyContainer(mySqlContainer),
        destroyContainer(rabbitContainer),
        destroyContainer(redisContainer),
    ])
        .catch(() => logger.error('Unable to destroy containers, manual cleanup required'))
        .then(() => process.exit());
};

async function setTimeoutToDestroyContainers() {
    return setTimeout(() => {
        logger.error(`Unable to connect to a container in ${CONNECTION_TIMEOUT} ms, exiting`);
        cleanupAfterError();
    }, CONNECTION_TIMEOUT);
}

async function checkConnectivityToService(checkConnectivity) {
    let connecting = true;

    const connectionTimeout = await setTimeoutToDestroyContainers();

    // eslint-disable-next-line no-restricted-syntax
    while (connecting) {
        try {
            await checkConnectivity();
            clearTimeout(connectionTimeout);
            connecting = false;
        } catch (err) {
            await new Promise((resolve) => {
                setTimeout(() => resolve(), RETRY_TIMEOUT);
            });
        }
    }
}

const buildDatabases = async() => {
    // Create databases
    for (const key in db) {
        await database.executeQuery(db[key]);
    }

    // Create tables
    for (const key in table) {
        await database.executeQuery(table[key]);
    }

    // Insert data
    for (const key in data) {
        await database.executeQuery(data[key]);
    }

    // Create functions
    for (const key in fn) {
        await database.executeQuery(fn[key]);
    }

    // Create users
    for (const key in user) {
        await database.executeQuery(user[key]);
    }
};

const pullImages = async() => Promise.all([
    pullImage(MYSQL_IMAGE),
    pullImage(RABBIT_IMAGE),
    pullImage(REDIS_IMAGE),
]);

const createContainers = async() => {
    [
        mySqlContainer,
        mySqlContainer,
        mySqlContainer,
    ] = await Promise.all([
        createContainer(
            MYSQL_IMAGE,
            { [`${MYSQL_PORT}/tcp`]: [{ HostPort: MYSQL_PORT }] },
            [`MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}`, `MYSQL_DATABASE=${MYSQL_DATABASE}`],
        ),
        createContainer(RABBIT_IMAGE, { [`${RABBIT_PORT}/tcp`]: [{ HostPort: RABBIT_PORT }] }),
        createContainer(REDIS_IMAGE, { [`${REDIS_PORT}/tcp`]: [{ HostPort: REDIS_PORT }] }),
    ]);
};

const checkConnectivity = async() => Promise.all([
    checkConnectivityToService(async() => await database.executeQuery('SHOW DATABASES')),
    checkConnectivityToService(async() => {
        const connection = await amqp.connect(`amqp://${RABBIT_HOST}:${RABBIT_PORT}`);
        await connection.close();
    }),
    checkConnectivityToService(async() => {
        // TODO Actually check the redis connectivity :p
    }),
]);

(async() => {
    try {
        logger.info('Creating containers');

        await pullImages();
        await createContainers();
        await checkConnectivity();
        await buildDatabases();

        run();
    } catch (err) {
        logger.error('Problem creating container: ', err);

        // Do not await
        cleanupAfterError();
    }

    after(async function cleanup() {
        this.timeout(CLEANUP_TIMEOUT);
        await cleanupAfterError();
    });
})();

process.on('SIGINT', () => {
    console.log('Caught interrupt signal');
    cleanupAfterError();
});
