// Node dependencies
const http = require('http');

// 3rd party dependencies
const express = require('express');
const bodyParser = require('body-parser');
const httpStatus = require('http-status-codes');
const swagger = require('swagger-express-mw');

// Palringo dependencies
const loggerFactory = require('@palringo/logger')();

// Variables
const logger = loggerFactory.getLogger('SwaggerExpress');

// For high HTTP throughput
http.globalAgent = new http.Agent({ keepAlive: true });

// Constants
const PORT = 8080;
// eslint-disable-next-line no-magic-numbers
const TWO_MINS_MS = 2 * 60 * 1000;

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        // when you add a custom error handler, you will want to delegate to the default error
        // handling mechanisms in Express, when the headers have already been sent to the client
        return next(err);
    }
    logger.error(`Error caught by middleware handler for ${req.method} ${req.originalUrl}: `, err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
};

const init = () => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true, limit: '32mb' }));
    app.use(bodyParser.json({ limit: '32mb' }));
    app.use((req, res, next) => {
        res.type('application/json');
        next();
    });

    const swaggerConfig = { appRoot: __dirname.replace('/api/swagger', '') };

    return new Promise((resolve, reject) => {
        swagger.create(swaggerConfig, (err, swaggerExpress) => {
            if (err) {
                return reject(err);
            }

            swaggerExpress.register(app);

            app.route('/healthcheck').get((req, res) => res.status(httpStatus.OK).end());

            app.use(errorHandler);

            const port = process.env.PORT || PORT;
            const server = app.listen(port);

            // ensure the UNIX socket doesn't timeout
            server.keepAliveTimeout = TWO_MINS_MS;

            logger.info(`Service started on port: ${port}`);

            server.on('clientError', (clientErr, socket) => {
                logger.error('Server received a clientError event: ', clientErr);
                socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            });

            return resolve(server);
        });
    });
};

module.exports = {
    init,
};
