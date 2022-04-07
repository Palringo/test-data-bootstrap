/* eslint-disable no-process-exit,promise/catch-or-return,no-loop-func */

// Third party dependencies
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
const trigger = moduleIsAvailable('./trigger.sql') ? require('./trigger.sql') : {};
const data = moduleIsAvailable('./data.sql') ? require('./data.sql') : {};
const fn = moduleIsAvailable('./function.sql') ? require('./function.sql') : {};
const user = moduleIsAvailable('./user.sql') ? require('./user.sql') : {};

// Variables
const dbSetupCfg = config.get('dbSetup');
const database = new DbPool(dbSetupCfg);
const docker = new Docker();
const logger = loggerFactory.getLogger('IntegrationTestBootstrap');

let mysqlContainer;

// Constants
const CLEANUP_TIMEOUT = 50000;
const CONNECTION_TIMEOUT = 30000;
const RETRY_TIMEOUT = 1000;

const MYSQL_IMAGE = 'mysql:5.7';
const MYSQL_DATABASE = dbSetupCfg.database;
const MYSQL_PORT = dbSetupCfg.port.toString();
const MYSQL_ROOT_PASSWORD = dbSetupCfg.password;


async function pullMySqlContainer() {
    const options = {
        filters: `{"reference": ["${MYSQL_IMAGE}"]}`,
    };

    const images = await docker.listImages(options);

    if (images.length === 0) {
        logger.info(`Pulling ${MYSQL_IMAGE} docker image`);

        await new Promise((resolve, reject) => {
            docker.pull(MYSQL_IMAGE, (err, stream) => {
                if (err) {
                    return reject(err);
                }
                return docker.modem.followProgress(stream, resolve);
            });
        });
    }
}

async function createMySqlContainer() {
    mysqlContainer = await docker.createContainer({
        Image: MYSQL_IMAGE,
        Name: 'integration-test-mysql',
        Hostname: 'integration-test-mysql',
        Env: [
            `MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}`,
            `MYSQL_DATABASE=${MYSQL_DATABASE}`,
        ],
        Cmd: [
            'mysqld',
            '--sql_mode=',
        ],
        HostConfig: {
            PortBindings: {
                [`${MYSQL_PORT}/tcp`]: [
                    {
                        HostPort: MYSQL_PORT,
                    },
                ],
            },
        },
    });

    await mysqlContainer.start();
}

async function destroyMySqlContainer() {
    if (mysqlContainer) {
        await mysqlContainer.stop();
        await mysqlContainer.remove();
    }
}

async function checkConnectivityToMysqlContainer() {
    let connecting = true;
    let reconnectTimeout;

    const connectionTimeout = setTimeout(() => {
        logger.error(`Unable to connect to mysql container in ${CONNECTION_TIMEOUT} ms, exiting`);
        clearTimeout(reconnectTimeout);
        destroyMySqlContainer()
            .catch(() => logger.error('Unable to destroy mysql container, manual cleanup required'))
            .then(() => process.exit());
    }, CONNECTION_TIMEOUT);

    // eslint-disable-next-line no-restricted-syntax
    while (connecting) {
        try {
            await database.executeQuery('SHOW DATABASES');
            clearTimeout(connectionTimeout);
            connecting = false;
        } catch (err) {
            await new Promise((resolve) => {
                reconnectTimeout = setTimeout(() => resolve(), RETRY_TIMEOUT);
            });
        }
    }
}

(async() => {
    try {
        logger.info('Creating containers');

        await Promise.all([
            pullMySqlContainer(), 
        ]);

        await Promise.all([
            createMySqlContainer(), 
        ]);

        await Promise.all([
            checkConnectivityToMysqlContainer(),
        ]);

        // Create databases
        for (const key in db) {
            await database.executeQuery(db[key]);
        }

        // Create tables
        for (const key in table) {
            await database.executeQuery(table[key]);
        }

        // Create triggers
        for (const key in trigger) {
            await database.executeQuery(trigger[key]);
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

        run();
    } catch (err) {
        logger.error('Problem creating container: ', err);
        Promise.all([
            destroyMySqlContainer(),
        ])
            .catch(() => logger.error('Unable to destroy containers, manual cleanup required'))
            .then(() => process.exit());
    }

    after(async function cleanup() {
        this.timeout(CLEANUP_TIMEOUT);

        try {
            await Promise.all([
                destroyMySqlContainer(),
            ]);
        } catch (err) {
            logger.error('Unable to destroy mysql container, manual cleanup required');
        }
    });
})();
